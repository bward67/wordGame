import React, { useState, useRef, useEffect } from "react";
import "./componentsAssemblyEndgame/assemblyEndgame.css";
import { languages } from "./componentsAssemblyEndgame/languages.js";
//! we must destructure b/c it didn't say default on the languages.js file
import { nanoid } from "nanoid";
import { clsx } from "clsx";
import {
  getFarewellText,
  getRandomWord,
} from "./componentsAssemblyEndgame/utils.js";
// import Confetti from "react-confetti";
import tom from "./assets/IMG_4027 (1).jpg";

const App = () => {
  //! -----State values ---------
  const [currentWord, setCurrentWord] = useState(getRandomWord());

  //console.log(currentWord);
  const [guessedLetters, setGuessedLetters] = useState([]);
  const ctaSection = useRef(null);
  //console.log(ctaSection);

  const scrollToCta = () => {
    ctaSection.current.scrollIntoView({ behavior: "smooth" });
  };

  //! ---- Derived values --------
  const numGuessesLeft = languages.length - 1;
  //console.log(guessedLetters);
  // const wrongGuessCount = guessedLetters.length;
  // minus isCorrect but we don't have access to it here so we can do a filter to include in our array only the answers that are incorrect
  let wrongGuessCount = guessedLetters.filter(
    (letter) => !currentWord.includes(letter)
  ).length;
  // console.log(wrongGuessCount);

  //so we turn the currentWord string into an array and then loop over it and check if EVERY letter is included in the guessedLetters array
  const isGameWon = currentWord
    .split("")
    .every((letter) => guessedLetters.includes(letter));
  //console.log(isGameWon);

  //we do minus 1 so that we always leave the last item in the languages array
  const isGameLost = wrongGuessCount >= languages.length - 1;

  const isGameOver = isGameWon || isGameLost;
  const lastGuessedLetter = guessedLetters[guessedLetters.length - 1]; // b/c it will be the last item in the array
  const isLastGuessIncorrect =
    lastGuessedLetter && !currentWord.includes(lastGuessedLetter);
  //if we don't put the lastGuessedLetter === true here when the page loads - the lastGuessedLetter array is empty so it will not work.

  //! -------Static values ----------
  const alphabet = "abcdefghijklmnopqrstuvwxyz";

  const handleGuessedLetter = (letter) => {
    //! but if we click the same key again we don't want it to appear in our array more than once
    setGuessedLetters((prev) =>
      prev.includes(letter) ? prev : [...prev, letter]
    );
  };

  const languageElements = languages.map((item, index) => {
    const isLanguageLost = index < wrongGuessCount;
    const className = clsx("chips-btn", isLanguageLost ? "lost" : "");
    return (
      <span
        key={item.name}
        //or we could do this:                       className={`chips-btn ${isLanguageLost ? "lost" : ""}`}
        className={className}
        style={{ backgroundColor: item.backgroundColor, color: item.color }}
      >
        {item.name}
      </span>
    );
  });

  const gameOverClass = clsx("cta", "cta-space", {
    won: isGameWon,
    lost: isGameLost,
    farewell: !isGameOver && isLastGuessIncorrect,
  });
  // const wrongGuessCountForFarewellMsg = wrongGuessCount - 1;
  // console.log(wrongGuessCountForFarewellMsg);

  // console.log(languages[wrongGuessCountForFarewellMsg].name);

  //! how to put the farewell messages up each time another wrong guess is made?? WELL wrongGuessCount should work with the index of the ultis.js function: getFarewellText(language) - so maybe not the index but the languages Array and this will go in the null part of the gameOverFunction

  //

  const gameOverFunction = () => {
    if (!isGameOver && isLastGuessIncorrect) {
      return (
        // but only show this conditionally if a wrong ans and we want the language to be dynamic matching the languages.name
        <>
          <h2>{getFarewellText(languages[wrongGuessCount - 1].name)}</h2>
        </>
      );
    }
    if (isGameWon) {
      scrollToCta();
      return (
        <>
          <h2>Winner Winner</h2>
          <h3>Gok Dinner 🎉</h3>
        </>
      );
    }
    if (isGameLost) {
      scrollToCta();
      return (
        <>
          <h2>Sorry Tom - you lost</h2>
          <br></br>
          <h3>
            The correct word was {""}
            <br></br>
            <span
              style={{
                textTransform: "uppercase",
                fontWeight: "bold",
                color: "yellow",
                letterSpacing: "5px",
              }}
            >
              {currentWord}
            </span>
            {/* Better start learning Assembly 😭 */}
          </h3>
        </>
      );
    }
    return null;
  };

  const handleNewGame = () => {
    setGuessedLetters([]);
    setCurrentWord(getRandomWord());
  };

  //!--------------------------------------------------

  return (
    <main>
      {/* {isGameWon && <Confetti  recyle={false} numberOfPieces={1000}/>} */}
      <header>
        <h1>Save U2: Endgame</h1>

        <div className="img-container">
          <p>
            <strong>TOM WARD</strong>
            <br></br>
            <br></br> your mission...<br></br>{" "}
            <i>should you choose to accept it</i>
            <br></br>... is to Guess the word(s) <br></br>in under 8 attempts{" "}
            <br></br>to keep U2 alive <br></br>in the music world!
          </p>
          <img src={tom} alt="" />
        </div>
      </header>
      <section
        aria-live="polite"
        role="status"
        className={gameOverClass}
        ref={ctaSection}
      >
        {gameOverFunction()}
        {/* {isGameOver ? (
          isGameWon ? (
            <>
              <h2>You win!</h2>
              <h3>Well done! 🎉</h3>
            </>
          ) : (
            <>
              <h2>Game over!</h2>
              <h3>You lose! Better start learning Assembly 😭</h3>
            </>
          )
        ) : null} */}
      </section>
      <section className="chips-section">
        {/* if the wrongGuessCount is 3 we want to remove / filter out index 0, 1 & 2 */}
        {languageElements}
      </section>
      {/* so instead of displaying all of the letters of the currentWord array when we loop over it - we just want to display the letter which is included in the guessed Letters Array - so the one the user has clicked on - we don't have to worry about where it will be placed b/c we are really just either displaying it or displaying a empty string "" if the guessedLetter does not include the letter in the currentWord array*/}
      <section className="word-container">
        {/* but when the game is LOST  we want to display the currentWord here*/}
        {currentWord.split("").map((letter) => {
          const shouldRevealLetter =
            isGameLost || guessedLetters.includes(letter);
          //! then to turn the revealed word red
          const revealedLetterClassName = clsx(
            isGameLost && !guessedLetters.includes(letter) && "revealed-letters"
          );
          return (
            <span key={nanoid()} className={revealedLetterClassName}>
              {shouldRevealLetter ? letter.toUpperCase() : ""}
            </span>
          );
        })}
      </section>
      {/*  ----------------A11y section----------------- */}
      {/* must make the above a11y - so the screen ready will read this and we won't see it on screen */}
      <section className="sr-only" aria-live="polite" role="status">
        <p>
          {currentWord.includes(lastGuessedLetter)
            ? `Correct! The letter ${lastGuessedLetter} is in the word.`
            : `Sorry, the letter ${lastGuessedLetter} is not in the word.`}
          You have {numGuessesLeft} attempts left.
        </p>
        <p>
          Current word:{" "}
          {currentWord
            .split("")
            .map((letter) =>
              guessedLetters.includes(letter) ? letter + "." : "blank."
            )
            .join(" ")}
          {/* using "." here will make the screen reader take a little pause so that it doesn't read out the letter too fast */}
        </p>
      </section>
      {/*  -------------End of A11y section-------------- */}
      <section className="keyboard">
        {alphabet.split("").map((letter) => {
          //!we check does the letter the user clicked includes the letter in the alphArray we are looping over
          const isGuessed = guessedLetters.includes(letter);
          const isCorrect = isGuessed && currentWord.includes(letter);
          const isWrong = isGuessed && !currentWord.includes(letter);
          const className = clsx({
            correct: isCorrect, //! only if isCorrect is true
            wrong: isWrong, //! only if isWrong is true
          });
          //! then we must create these classes in our css

          //console.log(className);

          return (
            <button
              onClick={() => handleGuessedLetter(letter)}
              // this letter is the letter in the alphabet array
              key={nanoid()}
              className={className}
              // don't forget to add this className={className}
              disabled={isGameOver}
              //this way the user cannot click another letter once the game is over
              aria-disabled={guessedLetters.includes(letter)}
              aria-label={`Letter ${letter}`}
            >
              {letter.toUpperCase()}
            </button>
          );
        })}
      </section>
      <footer>
        {isGameOver && (
          <button onClick={handleNewGame} className="new-game-btn">
            New Game
          </button>
        )}
      </footer>
    </main>
  );
};

export default App;

//PLAYING AROUND
// const [learnEnough, setLearnEnough] = useState(true);
// learnEnough
//   ? console.log("I will actively seek a junior frontend developer job")
//   : console.log("I will just continue to code as a hobby");
