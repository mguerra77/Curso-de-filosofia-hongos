import Header from '../components/Header'
import MainContent from '../components/MainContent'
import PricingSection from '../components/PricingSection'
import AuthorSection from '../components/AuthorSection'

function HomePage() {
  return (
    <div className="min-h-screen w-full bg-gray-50">
      <Header />
      <MainContent />
      <PricingSection />
      <AuthorSection />
    </div>
  )
}

export default HomePage
