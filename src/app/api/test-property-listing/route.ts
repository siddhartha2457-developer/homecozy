import { NextResponse } from "next/server"
import { sendTestPropertyListing } from "../../actions/property-listing-actions"

export async function GET() {
  try {
    const result = await sendTestPropertyListing()

    if (result.success) {
      return NextResponse.json({ message: result.message }, { status: 200 })
    } else {
      return NextResponse.json({ error: result.message }, { status: 500 })
    }
  } catch (error) {
    console.error("Error in test-property-listing route:", error)
    return NextResponse.json({ error: "Failed to send test property listing" }, { status: 500 })
  }
}
