import {
  OK,
  NOT_FOUND,
  NO_CONTENT,
  CREATED,
  INTERNAL_SERVER_ERROR,
} from "../status.mjs";

import {
  getMemes,
  get_all_correct_captions,
  get_correct_captions,
  get_incorrect_captions,
  insert_game,
} from "../dao/MemeDao.mjs";

// Function to shuffle an array
function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

export const getGetForNonAuthenticatedUser = async () => {
  const meme = await getMemes(1);
  if (!meme) return NO_CONTENT();

  const correct_captions = await get_correct_captions(meme[0].id);
  if (!correct_captions)
    return NOT_FOUND(
      `No correct captions found for meme with id: ${meme[0].id}`
    );

  const incorrect_captions = await get_incorrect_captions(meme[0].id);
  if (!incorrect_captions) return NOT_FOUND("No incorrect captions were found");

  const final_array = [...incorrect_captions, ...correct_captions];
  const shuffled_array = shuffleArray(final_array);

  const obj = {
    meme: meme,
    captions: shuffled_array,
  };

  return OK(obj);
};

export const getGetForAuthenticatedUser = async () => {
  let array = [];
  const meme = await getMemes(3);
  if (!meme) return NO_CONTENT();

  for (let i = 0; i < meme.length; i++) {
    const correct_captions = await get_correct_captions(meme[i].id);
    if (!correct_captions)
      return NOT_FOUND(
        `No correct captions found for meme with id: ${meme[i].id}`
      );
    const incorrect_captions = await get_incorrect_captions(meme[i].id);
    if (!incorrect_captions)
      return NOT_FOUND("No incorrect captions were found");
    const final_array = [...incorrect_captions, ...correct_captions];
    const shuffled_array = shuffleArray(final_array);
    const obj = {
      meme: meme[i],
      captions: shuffled_array,
    };
    array.push(obj);
  }

  return OK(array);
};

export const verifyAnswerService = async (meme_id, answer) => {
  const correct_captions = await get_all_correct_captions(meme_id);
  for (let i = 0; i < correct_captions.length; i++) {
    if (correct_captions[i].caption === answer) {
      const obj = {
        isCorrect: true,
      };
      return CREATED(obj);
    }
  }
  const obj = {
    isCorrect: false,
  };
  return CREATED(obj);
};

export const getCorrectCaptions = async (meme_id, selected_captions) => {
  if (!selected_captions) return NOT_FOUND("No captions were present");

  const returned_captions = [];

  const correct_captions = await get_all_correct_captions(meme_id);

  if (!correct_captions) return NOT_FOUND("No correct captions found for meme");

  for (let i = 0; i < selected_captions.length; i++) {
    for (let j = 0; j < correct_captions.length; j++) {
      if (selected_captions[i].caption === correct_captions[j].caption) {
        returned_captions.push(selected_captions[i]);
      }
    }
  }

  const obj = {
    captions: returned_captions,
  };
  return CREATED(obj);
};

// insert a new game into the database

export const storeGameService = async (user_id, memes, scores) => {
  const game = await insert_game(user_id, memes, scores);
  if (!game)
    return INTERNAL_SERVER_ERROR(
      "A generic error occurred during game storing"
    );
  return CREATED();
};
