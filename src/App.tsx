import Starfield from './components/Background/Starfield'; 
import StorySection from './components/Story/StorySection';
import ProjectSlider from './components/Projects/Projects';
import PhotosSlider from './components/Photos/Photos';
import Footer from './components/footer/footer';
import Contact from './components/Contacts/Contact';
import "./styles/theme.css";
import ThemeSwitch from './components/toggle/toggle';


function App() {
  return (
    <div className="app-shell">
        <ThemeSwitch />

        <Starfield />

      <main className="content-wrapper">
        
        <section className="section" id="about">
          <StorySection />
        </section>

        <section className="section" id="projects">
          <ProjectSlider />
        </section>
        <section className="section" id="photos">
          <h2 className="section-header">/// PHOTOS</h2>
          <PhotosSlider />
        </section>
        <section className="section" id="contact">
          <h2 className="section-header">/// Contact</h2>
          <Contact />
        </section>
        <section  id="footer">
          <h2 className="section-header">/// Footer</h2>
          <Footer />
        </section>

        
      </main>
    </div>
  );
}

export default App;