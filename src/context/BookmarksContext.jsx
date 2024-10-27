/* eslint-disable react/prop-types */
import { createContext, useState } from "react";

export const BookmarksContext = createContext();

export function BookmarksProvider({ children }) {
  const [bookmarks, setBookmarks] = useState([]);

  return (
    <BookmarksContext.Provider value={[bookmarks, setBookmarks]}>
      {children}
    </BookmarksContext.Provider>
  );
}
