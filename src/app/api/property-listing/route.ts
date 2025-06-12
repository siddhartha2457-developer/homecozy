import { NextResponse } from "next/server"
import { submitPropertyListing } from "../../actions/property-listing-actions"

export async function POST(request: Request) {
  try {
    const body = await request.json()

    if (!body || typeof body !== "object") {
      const res = NextResponse.json({ error: "Invalid request body" }, { status: 400 })
      res.headers.set("Access-Control-Allow-Origin", "*") // or specific domain
      return res
    }

    const { ownerName, email, phone, propertyType, propertyName, location, description, priceRange } = body

    const result = await submitPropertyListing({
      ownerName: ownerName || "",
      email: email || "",
      phone: phone || "",
      propertyType: propertyType || "",
      propertyName: propertyName || "",
      location: location || "",
      description: description || "",
      priceRange: priceRange || "",
    })

    const res = result.success
      ? NextResponse.json({ message: result.message }, { status: 200 })
      : NextResponse.json({ error: result.message }, { status: 400 })

    res.headers.set("Access-Control-Allow-Origin", "*") // or "https://cozyhomestays.com"
    return res
  } catch (error) {
    console.error("Error in property-listing route:", error)
    const res = NextResponse.json({ error: "Failed to process property listing" }, { status: 500 })
    res.headers.set("Access-Control-Allow-Origin", "*")
    return res
  }
}
