import SearchBar from './components/searchBar'

const App = () => {
  return (
    <div className="h-screen flex flex-col items-center justify-center bg-gray-900 text-red-500">
      <h1 className="text-5xl font-extrabold mb-8 tracking-wide">
        Recipe App
      </h1>
      <SearchBar />
    </div>
  )
}

export default App
