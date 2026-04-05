"use server";

import { z } from "zod";
import { db } from "../db";
import { contacts, notifications } from "~/server/db/schema";
import { eq, and } from "drizzle-orm";
import { env } from "~/env";

// Validation schema for contact form
const contactFormSchema = z.object({
  name: z.string().min(1, "Name is required").max(200),
  email: z.string().email("Invalid email address"),
  phone: z.string().optional(),
  message: z.string().min(1, "Message is required").max(5000),
});

export type ContactFormData = z.infer<typeof contactFormSchema>;

export async function submitContactForm(formData: ContactFormData) {
  try {
    // Validate input
    const validatedData = contactFormSchema.parse(formData);
    
    // Get account ID from environment
    const accountId = BigInt(env.NEXT_PUBLIC_ACCOUNT_ID);
    
    // Split name into first and last name
    const nameParts = validatedData.name.trim().split(' ');
    const firstName = nameParts[0] || '';
    const lastName = nameParts.slice(1).join(' ') || '';
    
    // Check if contact already exists
    const [existingContact] = await db
      .select()
      .from(contacts)
      .where(
        and(
          eq(contacts.accountId, accountId),
          eq(contacts.email, validatedData.email)
        )
      )
      .limit(1);
    
    let contactId: bigint;
    
    if (existingContact) {
      // Update existing contact with phone and append new message to notes
      contactId = existingContact.contactId;
      
      const updates: any = { updatedAt: new Date() };
      
      // Update phone if provided and not already set
      if (validatedData.phone && !existingContact.phone) {
        updates.phone = validatedData.phone;
      }
      
      // Append new message to existing notes
      const currentInfo = existingContact.additionalInfo || {};
      const existingNotes = (currentInfo as any).notes || '';
      const newMessage = `[${new Date().toLocaleDateString('es-ES')}] Nuevo mensaje vía web: "${validatedData.message}"`;
      
      updates.additionalInfo = {
        ...currentInfo,
        notes: existingNotes ? `${existingNotes}\n${newMessage}` : newMessage,
        lastWebContact: new Date().toISOString(),
      };
      
      await db
        .update(contacts)
        .set(updates)
        .where(eq(contacts.contactId, contactId));
    } else {
      // Create new contact
      const [newContact] = await db
        .insert(contacts)
        .values({
          accountId,
          firstName,
          lastName,
          email: validatedData.email,
          phone: validatedData.phone || null,
          additionalInfo: {
            source: 'website_contact_form',
            firstContactDate: new Date().toISOString(),
            notes: `Contacto generado vía web: "${validatedData.message}"`,
          },
          isActive: true,
        })
        .returning({ contactId: contacts.contactId });

      contactId = newContact!.contactId;
    }
    
    // Create notification for the team
    await db.insert(notifications).values({
      accountId,
      userId: null, // Broadcast to all users in account
      fromUserId: null, // System/anonymous sender
      type: 'website_inquiry',
      title: `Nuevo mensaje de ${validatedData.name}`,
      message: validatedData.message,
      category: 'contacts',
      priority: 'high',
      entityType: 'contact',
      entityId: contactId,
      metadata: {
        formData: {
          name: validatedData.name,
          email: validatedData.email,
          phone: validatedData.phone || null,
          submittedAt: new Date().toISOString(),
        },
        source: 'website_contact_form',
      },
      actionUrl: `/contactos/${contactId}`,
      deliveryChannel: 'in_app',
      isDelivered: true,
      deliveredAt: new Date(),
      isActive: true,
    });
    
    return {
      success: true,
      contactId: contactId.toString(),
      message: 'Mensaje enviado correctamente',
    };
    
  } catch (error) {
    console.error('Error submitting contact form:', error);
    
    if (error instanceof z.ZodError) {
      return {
        success: false,
        error: 'Datos del formulario inválidos',
        details: error.errors,
      };
    }
    
    return {
      success: false,
      error: 'Error al enviar el mensaje. Por favor, inténtalo de nuevo.',
    };
  }
}