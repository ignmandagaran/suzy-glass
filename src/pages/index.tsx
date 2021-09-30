import dynamic from 'next/dynamic'

const SuziCanvas = dynamic(
  () => import('../components/sections/home/suzi-canvas'),
  {
    ssr: false
  }
)

const HomePage = () => {
  return <SuziCanvas />
}

export default HomePage
