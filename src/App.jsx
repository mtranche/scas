import './App.scss';
import SearchComponent from './components/searchComponent';

function App() {
  return (
    <div className='container-fluid mt-5'>
      <h2 className='text-center'>Users list</h2>
      <SearchComponent />
    </div>
  );
}

export default App;
