import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import "./styles/main.scss";

import Footer from './components/partials/Footer';
import NavBar from './components/partials/NavBar';
import Page from './components/Page';

import Index from './pages/Index';
import Movie from './pages/Movie';
import Tv from './pages/Tv';
import Search from './pages/Search';
import List from './pages/List';
import Error_ from './pages/Error';
import Player from './pages/Player';
import Laffa from './pages/Laffa';
import Player_Laffa from './pages/Player-Laffa';
import BetweenThe2 from './pages/BetweenThe2';
import Player_BetweenThe2 from './pages/Player-BetweenThe2';
import Zeina from './pages/Zeina';
import Player_Zeina from './pages/Player-Zeina';
import RandomMovie from './pages/Random';

function Main() {  
  return (
    <BrowserRouter>
      <NavBar />
      <Page>
        <Routes>
          <Route path='/' element={<Index />} />

          <Route path='/search' element={<Search />} />

          <Route path="/list" element={<List />} />

          <Route path="/random" element={<RandomMovie />} />

          <Route path='/movie/:id' element={<Movie />} />

          <Route path='/tv/:id' element={<Tv />} />

          <Route path='/player/:id' element={<Player />} />

          <Route path="/unavailable" element={<Error_ message="The media you're looking for is unavailable, please try again later." />} />

          <Route path="/*" element={<Error_ message="The page you're looking for does not exist" />} />
        </Routes>
      </Page>

      <Footer />
    </BrowserRouter>
  )
}

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(<Main />);