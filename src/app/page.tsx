import React from 'react'
import Header from './(root)/component/header/header'
import Footer from './(root)/component/footer/footer'
import Hero from './(root)/component/hero/hero'
import FAQ from './(root)/component/faq/faq'
import GoToTop from './(root)/component/go-totop/goto'


export default function page() {
  return (
    <>
    <Header/>
    <Hero/>
    <FAQ />
      <GoToTop />
    <Footer/>
    </>
  )
}
 