import Header from '../components/Header'
import MainContent from '../components/MainContent'
import PricingSection from '../components/PricingSection'
import AuthorSection from '../components/AuthorSection'
import Footer from '../components/Footer'

function HomePage() {
  return (
    <div className="min-h-screen w-full flex flex-col">
      <Header />
      <MainContent />
      <PricingSection />
      <AuthorSection />
      <Footer />
    </div>
  )
}

export default HomePage
