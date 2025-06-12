"use server"

import nodemailer from "nodemailer"

// Define the type for property listing data
type PropertyListingData = {
  ownerName: string
  email: string
  phone: string
  propertyType: string
  propertyName: string
  location: string
  description: string
  priceRange: string
}

// Function to validate email configuration
function validateEmailConfig() {
  const requiredVars = ["EMAIL_HOST", "EMAIL_PORT", "EMAIL_USER", "EMAIL_PASS", "EMAIL_RECIPIENT"]
  const missingVars = requiredVars.filter((varName) => !process.env[varName])

  if (missingVars.length > 0) {
    throw new Error(`Missing required environment variables: ${missingVars.join(", ")}`)
  }

  return true
}

// Create a transporter for sending emails
function createTransporter() {
  try {
    validateEmailConfig()
    return nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: Number(process.env.EMAIL_PORT),
      secure: true,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    })
  } catch (error) {
    console.error("Failed to create email transporter:", error)
    throw new Error("Email service configuration error")
  }
}

// Format the property listing data into a readable email body
function formatPropertyListingEmail(data: PropertyListingData) {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #07192f, #05254d); color: white; padding: 20px; border-radius: 8px 8px 0 0; }
        .content { background: #f9f9f9; padding: 20px; border-radius: 0 0 8px 8px; }
        .field { margin-bottom: 15px; }
        .label { font-weight: bold; color: #555; }
        .value { margin-top: 5px; padding: 8px; background: white; border-radius: 4px; border-left: 3px solid #ff6b6b; }
        .description { background: white; padding: 15px; border-radius: 4px; border: 1px solid #ddd; }
        .footer { margin-top: 20px; padding: 15px; background: #e8e8e8; border-radius: 4px; font-size: 14px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h2>🏠 New Property Listing Request</h2>
          <p>A new property owner wants to list their property on your platform!</p>
        </div>
        
        <div class="content">
          <div class="field">
            <div class="label">👤 Owner Name:</div>
            <div class="value">${data.ownerName}</div>
          </div>
          
          <div class="field">
            <div class="label">📧 Email Address:</div>
            <div class="value">${data.email}</div>
          </div>
          
          <div class="field">
            <div class="label">📱 Phone Number:</div>
            <div class="value">${data.phone}</div>
          </div>
          
          <div class="field">
            <div class="label">🏢 Property Type:</div>
            <div class="value">${data.propertyType}</div>
          </div>
          
          <div class="field">
            <div class="label">🏡 Property Name:</div>
            <div class="value">${data.propertyName}</div>
          </div>
          
          <div class="field">
            <div class="label">📍 Location:</div>
            <div class="value">${data.location}</div>
          </div>
          
          <div class="field">
            <div class="label">💰 Expected Price Range:</div>
            <div class="value">${data.priceRange}</div>
          </div>
          
          ${
            data.description
              ? `
          <div class="field">
            <div class="label">📝 Property Description:</div>
            <div class="description">${data.description}</div>
          </div>
          `
              : ""
          }
          
          <div class="footer">
            <strong>Next Steps:</strong>
            <ul>
              <li>Contact the owner within 24 hours</li>
              <li>Help them complete their listing</li>
              <li>Arrange professional photography if needed</li>
            </ul>
          </div>
        </div>
      </div>
    </body>
    </html>
  `
}

// Format auto-reply email for the property owner
function formatOwnerConfirmationEmail(data: PropertyListingData) {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #07192f, #05254d); color: white; padding: 20px; border-radius: 8px 8px 0 0; text-align: center; }
        .content { background: #f9f9f9; padding: 20px; border-radius: 0 0 8px 8px; }
        .highlight { background: white; padding: 15px; border-radius: 4px; border-left: 3px solid #07192f; margin: 15px 0; }
        .steps { background: white; padding: 20px; border-radius: 4px; margin: 15px 0; }
        .step { margin-bottom: 10px; }
        .footer { margin-top: 20px; padding: 15px; background: #e8e8e8; border-radius: 4px; font-size: 14px; text-align: center; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h2>🎉 Thank You for Your Interest!</h2>
          <p>We've received your property listing request</p>
        </div>
        
        <div class="content">
          <p>Dear ${data.ownerName},</p>
          
          <p>Thank you for choosing to list your property <strong>"${data.propertyName}"</strong> with us! We're excited to help you start earning from your beautiful space.</p>
          
          <div class="highlight">
            <h3>📋 What We Received:</h3>
            <p><strong>Property:</strong> ${data.propertyName} (${data.propertyType})</p>
            <p><strong>Location:</strong> ${data.location}</p>
            <p><strong>Price Range:</strong> ${data.priceRange}</p>
          </div>
          
          <div class="steps">
            <h3>🚀 What Happens Next:</h3>
            <div class="step">1. Our team will contact you within 24 hours</div>
            <div class="step">2. Help you create an amazing listing with professional photos</div>
            <div class="step">3. Your property goes live and starts earning!</div>
          </div>
          
          <p>In the meantime, feel free to gather any additional information about your property that might be helpful, such as:</p>
          <ul>
            <li>Recent photos of all rooms and amenities</li>
            <li>List of amenities and special features</li>
            <li>House rules or restrictions</li>
            <li>Availability calendar</li>
          </ul>
          
          <div class="footer">
            <p>Questions? Reply to this email </p>
            <p>We're here to help you succeed! 🏠✨</p>
          </div>
        </div>
      </div>
    </body>
    </html>
  `
}

// Validate property listing data
function validatePropertyListingData(data: PropertyListingData): string[] {
  const errors: string[] = []

  if (!data.ownerName?.trim()) {
    errors.push("Owner name is required")
  }

  if (!data.email?.trim()) {
    errors.push("Email address is required")
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
    errors.push("Please provide a valid email address")
  }

  if (!data.phone?.trim()) {
    errors.push("Phone number is required")
  }

  if (!data.propertyType?.trim()) {
    errors.push("Property type is required")
  }

  if (!data.propertyName?.trim()) {
    errors.push("Property name is required")
  }

  if (!data.location?.trim()) {
    errors.push("Location is required")
  }

  if (!data.priceRange?.trim()) {
    errors.push("Price range is required")
  }

  return errors
}

// Main function to submit property listing
export async function submitPropertyListing(data: PropertyListingData) {
  try {
    // Validate the data
    const validationErrors = validatePropertyListingData(data)
    if (validationErrors.length > 0) {
      return {
        success: false,
        message: `Please fix the following errors: ${validationErrors.join(", ")}`,
      }
    }

    const transporter = createTransporter()

    // Send notification email to admin
    const adminEmailInfo = await transporter.sendMail({
      from: `"CozyHomeStays" <${process.env.EMAIL_USER}>`,
      to: "cozyhomestays1985@gmail.com",
      subject: `New Property Listing: ${data.propertyName} in ${data.location}`,
      html: formatPropertyListingEmail(data),
    })

    // Send confirmation email to property owner
    const ownerEmailInfo = await transporter.sendMail({
      from: `"CozyHomeStays" <${process.env.EMAIL_USER}>`,
      to: data.email,
      subject: "Thank you for listing your property with us!",
      html: formatOwnerConfirmationEmail(data),
    })

    console.log("Admin email sent:", adminEmailInfo.messageId)
    console.log("Owner confirmation email sent:", ownerEmailInfo.messageId)

    return {
      success: true,
      message: "Your property listing has been submitted successfully! Check your email for confirmation.",
    }
  } catch (error) {
    console.error("Failed to submit property listing:", error)
    return {
      success: false,
      message: "Failed to submit your property listing. Please try again later." + (error instanceof Error ? ` Error: ${error.message}` : ""),
    }
  }
}

// Function to send a test property listing email
export async function sendTestPropertyListing() {
  const testData: PropertyListingData = {
    ownerName: "John Doe",
    email: "john.doe@example.com",
    phone: "+91 98765 43210",
    propertyType: "Villa",
    propertyName: "Sunset Paradise Villa",
    location: "Goa, India",
    description: "A beautiful beachfront villa with stunning sunset views, perfect for families and groups.",
    priceRange: "₹10,000 - ₹25,000 per night",
  }

  try {
    const result = await submitPropertyListing(testData)
    return result
  } catch (error) {
    console.error("Failed to send test property listing:", error)
    return {
      success: false,
      message: `Failed to send test property listing: ${error instanceof Error ? error.message : "Unknown error"}`,
    }
  }
}
