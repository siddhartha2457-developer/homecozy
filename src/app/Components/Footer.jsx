"use client"
import Link from "next/link"
import { FaFacebookF, FaTwitter, FaLinkedinIn, FaInstagram } from "react-icons/fa"
import "./Footer.css"

const Footer = () => {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="footer-section" itemScope itemType="http://schema.org/WPFooter">
      <div className="footer">
        <div className="footer-top">
          <Link href="/" aria-label="CozyHomeStays Homepage" style={{textDecoration:"none"}}>
            <h2 className="footer-logo" itemProp="name">
              CozyHomeStays
            </h2>
          </Link>
          <p className="footer-tagline" itemProp="description">
            Discover cozy stays across India
          </p>
        </div>

        <div className="footer-content">
          <nav className="footer-column" aria-labelledby="stay-locations">
            <h4 id="stay-locations">POPULAR DESTINATIONS</h4>
            <ul>
              <li>
                <Link href="/detail?q=Manali">Cottages in Manali</Link>
              </li>
              <li>
                <Link href="/detail?q=Dharamshala">Cottages in Dharamshala</Link>
              </li>
              <li>
                <Link href="/detail?q=Kasol">Cottages in Kasol</Link>
              </li>
              <li>
                <Link href="/detail?q=Rishikesh">Cottages in Rishikesh</Link>
              </li>
              <li>
                <Link href="/detail?q=Shimla">Cottages in Shimla</Link>
              </li>
              <li>
                <Link href="/detail?q=Mussoorie">Cottages in Mussoorie</Link>
              </li>
              <li>
                <Link href="/detail?q=Nainital">Cottages in Nainital</Link>
              </li>
              <li>
                <Link href="/detail?q=Goa">Beach Houses in Goa</Link>
              </li>
            </ul>
          </nav>

          <nav className="footer-column" aria-labelledby="more-destinations">
            <h4 id="more-destinations">MORE DESTINATIONS</h4>
            <ul>
              <li>
                <Link href="/detail?q=Coorg">Cottages in Coorg</Link>
              </li>
              <li>
                <Link href="/detail?q=Ooty">Cottages in Ooty</Link>
              </li>
              <li>
                <Link href="/detail?q=Munnar">Cottages in Munnar</Link>
              </li>
              <li>
                <Link href="/detail?q=Lonavala">Cottages in Lonavala</Link>
              </li>
              <li>
                <Link href="/detail?q=Udaipur">Cottages in Udaipur</Link>
              </li>
              <li>
                <Link href="/detail?q=Darjeeling">Cottages in Darjeeling</Link>
              </li>
              <li>
                <Link href="/detail?q=Kodaikanal">Cottages in Kodaikanal</Link>
              </li>
              <li>
                <Link href="/detail?q=Pondicherry">Stays in Pondicherry</Link>
              </li>
            </ul>
          </nav>

          <nav className="footer-column" aria-labelledby="even-more-destinations">
            <h4 id="even-more-destinations">POPULAR STAYS</h4>
            <ul>
              <li>
                <Link href="/detail?q=Jaipur">Stays in Jaipur</Link>
              </li>
              <li>
                <Link href="/detail?q=Agra">Stays in Agra</Link>
              </li>
              <li>
                <Link href="/detail?q=Hyderabad">Stays in Hyderabad</Link>
              </li>
              <li>
                <Link href="/detail?q=Bangalore">Stays in Bangalore</Link>
              </li>
              <li>
                <Link href="/detail?q=Lucknow">Stays in Lucknow</Link>
              </li>
              <li>
                <Link href="/detail?q=Ahmedabad">Stays in Ahmedabad</Link>
              </li>
              <li>
                <Link href="/detail?q=Kolkata">Stays in Kolkata</Link>
              </li>
              <li>
                <Link href="/detail?q=Chandigarh">Stays in Chandigarh</Link>
              </li>
            </ul>
          </nav>

          <nav className="footer-column" aria-labelledby="work-with-us">
            <h4 id="work-with-us">WORK WITH US</h4>
            <ul>
              <li>
                <Link href="/listproperty">List Your Property</Link>
              </li>
              <li>
                <Link href="/">Partner With Us</Link>
              </li>
              <li>
                <Link href="/">Careers</Link>
              </li>
            </ul>

            <h4 id="information">INFORMATION</h4>
            <ul>
              <li>
                <Link href="/">Cancellation Policy</Link>
              </li>
              <li>
                <Link href="/">Booking Policy</Link>
              </li>
              <li>
                <Link href="/">Privacy Policy</Link>
              </li>
              <li>
                <Link href="/">Terms of Service</Link>
              </li>
              <li>
                <Link href="/">Sitemap</Link>
              </li>
            </ul>
          </nav>
        </div>

        <div className="footer-bottom">
          <p>© {currentYear} CozyHomeStays. All rights reserved</p>
          {/* <div className="social-icons" aria-label="Social Media Links">
            <a
              href="https://facebook.com/cozyhomestays"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Follow us on Facebook"
            >
              <FaFacebookF />
            </a>
            <a
              href="https://twitter.com/cozyhomestays"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Follow us on Twitter"
            >
              <FaTwitter />
            </a>
            <a
              href="https://linkedin.com/company/cozyhomestays"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Follow us on LinkedIn"
            >
              <FaLinkedinIn />
            </a>
            <a
              href="https://instagram.com/cozyhomestays"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Follow us on Instagram"
            >
              <FaInstagram />
            </a>
          </div> */}
        </div>

        {/* Structured data for SEO */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              name: "CozyHomeStays",
              url: "https://www.cozyhomestays.com",
              logo: "https://www.cozyhomestays.com/logo.png",
              contactPoint: {
                "@type": "ContactPoint",
                telephone: "+91-XXXXXXXXXX",
                contactType: "customer service",
              },
              sameAs: [
                "https://www.facebook.com/cozyhomestays",
                "https://www.twitter.com/cozyhomestays",
                "https://www.linkedin.com/company/cozyhomestays",
                "https://www.instagram.com/cozyhomestays",
              ],
            }),
          }}
        />
      </div>
    </footer>
  )
}

export default Footer
