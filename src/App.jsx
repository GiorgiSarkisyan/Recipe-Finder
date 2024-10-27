import { useContext, useEffect, useState } from "react";
import { BiBookmark } from "react-icons/bi";
import { FaMagnifyingGlass } from "react-icons/fa6";
import { BookmarksContext } from "./context/BookmarksContext";
import toast from "react-hot-toast";
import Spinner from "./components/Spinner";

function App() {
  const [data, setData] = useState([]);
  const [selectRecipe, setSelectRecipe] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [filteredRecipes, setFilteredRecipes] = useState([]);
  const [active, setActive] = useState(false);
  const [bookmarks, setBookmarks] = useContext(BookmarksContext);
  const [fetchLoading, setFetchLoading] = useState(true);

  const recipesPerPage = 12;

  useEffect(() => {
    async function fetchData() {
      setFetchLoading(true);
      try {
        const response = await fetch("https://dummyjson.com/recipes");
        const data = await response.json();
        setData(data.recipes);
        setFilteredRecipes(data.recipes);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setFetchLoading(false);
      }
    }

    const savedBookmarks = JSON.parse(localStorage.getItem("bookmarks"));
    if (savedBookmarks) {
      setBookmarks(savedBookmarks);
    }

    fetchData();
  }, [setBookmarks]);

  function handleSearch() {
    const filtered = data.filter(
      (recipe) =>
        recipe.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        recipe.tags.some((tag) =>
          tag.toLowerCase().includes(searchQuery.toLowerCase())
        )
    );
    setFilteredRecipes(filtered);
    setCurrentPage(1);
  }

  const startIndex = (currentPage - 1) * recipesPerPage;
  const endIndex = startIndex + recipesPerPage;
  const currentRecipes = filteredRecipes.slice(startIndex, endIndex);

  function handleSelectRecipe(recipe) {
    setSelectRecipe(recipe);
  }

  function handleNextPage() {
    if (endIndex < filteredRecipes.length) {
      setFetchLoading(true);
      setTimeout(() => {
        setCurrentPage((prev) => prev + 1);
        setFetchLoading(false);
      }, 200);
    }
  }

  function handlePrevPage() {
    if (currentPage > 1) {
      setFetchLoading(true);
      setTimeout(() => {
        setCurrentPage((prev) => prev - 1);
        setFetchLoading(false);
      }, 200);
    }
  }
  function handleBookmark() {
    if (selectRecipe) {
      const isBookmarked = bookmarks.some((b) => b.id === selectRecipe.id);
      let updatedBookmarks;

      if (isBookmarked) {
        updatedBookmarks = bookmarks.filter((b) => b.id !== selectRecipe.id);
        toast.error("Bookmark Removed", {
          style: {
            backgroundColor: "orange",
            color: "white",
            fontFamily: "montserrat",
            width: "300px",
            height: "50px",
            fontSize: "18px",
          },
        });
      } else {
        updatedBookmarks = [...bookmarks, selectRecipe];
        toast.success("Bookmarked Successfully", {
          style: {
            backgroundColor: "orange",
            color: "white",
            fontFamily: "montserrat",
            width: "300px",
            height: "50px",
            fontSize: "18px",
          },
        });
      }

      setBookmarks(updatedBookmarks);
      localStorage.setItem("bookmarks", JSON.stringify(updatedBookmarks));
    }
  }

  return (
    <main className="h-dvh w-full bg-gradient-to-tr from-red-500 to-orange-500">
      <div className="max-w-[1600px] bg-zinc-300 h-full mx-auto shadow-2xl shadow-zinc-400 grid grid-rows-[160px,1fr]">
        <header className="flex justify-between items-center bg-gradient-to-r from-orange-500 to-red-500 h-full select-none px-10">
          <div className="flex items-center gap-10">
            <h1 className="font-script text-8xl text-white mr-4">Gloria</h1>
            <div className="flex w-[500px] h-20 rounded-full px-10 bg-white gap-2">
              <input
                type="text"
                className="focus:outline-none font-montserrat text-3xl w-full"
                placeholder="Search recipe.."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyUp={(e) => {
                  if (e.key === "Enter") {
                    handleSearch();
                  }
                }}
              />
              <span
                className="flex items-center justify-center rounded-full cursor-pointer"
                onClick={handleSearch}
              >
                <FaMagnifyingGlass className="w-10 h-10 text-orange-400 hover:scale-125 duration-300 transition-all" />
              </span>
            </div>
          </div>
          <label className="flex h-full items-center relative">
            <BiBookmark
              className={`w-16 h-16 transition-all duration-300 text-white hover:bg-white hover:text-orange-500 ${
                active ? "bg-white text-orange-500" : ""
              }`}
              onClick={() => setActive((prev) => !prev)}
            />
            {active && (
              <ul className="absolute top-full left w-[500px] bg-white border border-gray-300 z-10 translate-x-[-250px] min-h-40 p-5 shadow-lg">
                {bookmarks.length > 0 ? (
                  bookmarks.map((recipe, index) => (
                    <li
                      key={index}
                      className="transition-all duration-300 flex gap-5 border-b h-28 items-center  border-gray-400 cursor-pointer hover:bg-orange-400 hover:text-white"
                      onClick={() => handleSelectRecipe(recipe)}
                    >
                      <img
                        src={recipe.image}
                        alt={recipe.name}
                        className="w-20 h-20 rounded-full select-none"
                      />
                      <div className="flex flex-col justify-center">
                        <span className="font-script text-3xl font-bold text-gray-600">
                          {recipe.name}
                        </span>
                        <span className="font-montserrat text-xl font-medium">
                          {recipe.cuisine}
                        </span>
                      </div>
                    </li>
                  ))
                ) : (
                  <li className="text-center text-2xl text-gray-500 font-montserrat">
                    No Bookmarks
                  </li>
                )}
              </ul>
            )}
          </label>
        </header>
        <div className="grid grid-cols-[500px,1fr] h-full">
          <div className="bg-white">
            {fetchLoading ? (
              <Spinner />
            ) : (
              <>
                <ul className="py-5 px-2 h-[1190px]">
                  {currentRecipes.length > 0 ? (
                    currentRecipes.map((recipe, index) => (
                      <li
                        key={index}
                        className="duration-300 transition-all h-24 flex gap-5 border-b border-gray-400 cursor-pointer hover:bg-orange-400 hover:text-white hover:scale-105"
                        onClick={() => handleSelectRecipe(recipe)}
                      >
                        <div className="flex items-center justify-center">
                          <img
                            src={recipe.image}
                            alt={recipe.name}
                            className="w-20 h-20 rounded-full select-none"
                          />
                        </div>
                        <div className="flex flex-col justify-center">
                          <span className="font-script text-3xl font-bold text-gray-600">
                            {recipe.name}
                          </span>
                          <span className="font-montserrat text-xl font-medium">
                            {recipe.cuisine}
                          </span>
                        </div>
                      </li>
                    ))
                  ) : (
                    <li className="text-center text-lg text-gray-500">
                      No recipes found
                    </li>
                  )}
                </ul>
              </>
            )}
            <div className="flex justify-between p-5">
              <button
                onClick={handlePrevPage}
                disabled={currentPage === 1}
                className={`px-4 py-2 rounded-md bg-red-400 text-white ${
                  currentPage === 1 && "opacity-50 cursor-not-allowed"
                }`}
              >
                Previous
              </button>
              <button
                onClick={handleNextPage}
                disabled={endIndex >= filteredRecipes.length}
                className={`px-4 py-2 rounded-md bg-red-400 text-white ${
                  endIndex >= filteredRecipes.length &&
                  "opacity-50 cursor-not-allowed"
                }`}
              >
                Next
              </button>
            </div>
          </div>
          <div className="w-full bg-white p-5 overflow-auto h-[1270px]">
            {selectRecipe ? (
              <div className="w-full">
                <div className="flex w-full h-96">
                  <img
                    src={selectRecipe.image}
                    alt={selectRecipe.name}
                    className="object-cover w-full h-full rounded-lg"
                  />
                </div>
                <div className="flex flex-col">
                  <div className="flex w-full items-center flex-col translate-y-[-40px] gap-5">
                    <h2 className="text-4xl font-bold bg-orange-400 p-5 text-white font-script rounded-lg">
                      {selectRecipe.name}
                    </h2>
                    <h3>
                      <span className="font-montserrat font-medium text-xl">
                        {selectRecipe.mealType.join(" ")}
                      </span>
                    </h3>
                    <BiBookmark
                      className={`duration-300 transition-all absolute w-20 h-20 right-5 cursor-pointer ${
                        bookmarks.some((b) => b.id === selectRecipe.id)
                          ? "text-orange-400"
                          : "text-gray-400"
                      }`}
                      onClick={handleBookmark}
                    />
                  </div>
                  <div>
                    <div className="flex justify-around">
                      <div className="w-[250px] flex flex-col gap-2">
                        <div className="flex items-center justify-center">
                          <h3 className="font-montserrat text-lg text-center text-white bg-red-500 px-2 py-1 rounded-xl">
                            Instructions
                          </h3>
                        </div>
                        <ol className="list-decimal pl-5 flex flex-col gap-2">
                          {selectRecipe.instructions.map(
                            (instruction, index) => (
                              <li
                                key={index}
                                className="text-base font-bold text-gray-500 font-montserrat"
                              >
                                {instruction}
                              </li>
                            )
                          )}
                        </ol>
                      </div>
                      <div>
                        <div className="w-[250px] flex flex-col gap-2">
                          <div className="flex items-center justify-center">
                            <h3 className="font-montserrat text-lg text-center text-white bg-red-500 px-2 py-1 rounded-xl">
                              Ingredients
                            </h3>
                          </div>
                          <ul className="flex flex-col gap-2 list-disc ">
                            {selectRecipe.ingredients.map(
                              (ingredient, index) => (
                                <li
                                  key={index}
                                  className="text-base font-bold text-gray-500 font-montserrat "
                                >
                                  {ingredient}
                                </li>
                              )
                            )}
                          </ul>
                        </div>
                      </div>
                    </div>
                    <div className="flex justify-between px-10 mt-5">
                      <div className="w-[300px] flex flex-col gap-2 pt-5">
                        <span className="text-gray-600 font-montserrat text-xl font-semibold">
                          Difficulty: {selectRecipe.difficulty}
                        </span>
                        <span className="text-gray-600 font-montserrat text-xl font-semibold">
                          Prep time: {selectRecipe.prepTimeMinutes} Minutes ⌛
                        </span>
                        <span className="text-gray-600 font-montserrat text-xl font-semibold">
                          Servings: {selectRecipe.servings} 🍕
                        </span>
                      </div>
                      <div className="w-[300px] flex flex-col gap-2 text-right pt-5">
                        <span className="text-gray-600 font-montserrat text-xl font-semibold">
                          Rating: {selectRecipe.rating} ⭐
                        </span>
                        <span className="text-gray-600 font-montserrat text-xl font-semibold">
                          Cooking time: {selectRecipe.cookTimeMinutes} Minutes
                          ⏲️
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <h2 className="text-4xl text-center text-gray-500">
                Select a recipe to view details
              </h2>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}

export default App;
