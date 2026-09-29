import Footer from "@/components/biochemreg/Footer";
import Header from "@/components/biochemreg/Header";
import About from "@/components/biochemreg/home/About";
import Contact from "@/components/biochemreg/home/Contact";
import Hero from "@/components/biochemreg/home/Hero";
import Network from "@/components/biochemreg/home/Network";
import News from "@/components/biochemreg/home/News";
import Publications from "@/components/biochemreg/home/Publications";
import Research from "@/components/biochemreg/home/Research";
import Team from "@/components/biochemreg/home/Team";

export default function Home() {
    return (
        <>
            <Header />
            <Hero />
            <About />
            <Research />
            <Publications />
            <Team />
            <News />
            <Network />
            <Contact />
            <Footer />
        </>
    )
};