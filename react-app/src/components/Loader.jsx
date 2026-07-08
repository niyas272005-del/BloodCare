import { useEffect } from 'react'

export default function Loader() {
  useEffect(() => {
    const timer = setTimeout(() => {
      const loader = document.getElementById('loader')
      if (loader) loader.classList.add('hide')
    }, 1800)
    return () => clearTimeout(timer)
  }, [])

  return (
    <div id="loader" role="status" aria-label="Loading BloodCare">
      <div className="loader-heart"></div>
      <p className="loader-text">BloodCare</p>
    </div>
  )
}
