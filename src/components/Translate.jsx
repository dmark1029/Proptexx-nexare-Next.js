"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
const Translate = ({ text }) => {
  const { language } = useSelector((state) => state.auth);
  const lang = language.slice(0, 2);

  const [translatedText, setTranslatedText] = useState(text);
  const [targetLanguage, setTargetLanguage] = useState(lang);
  const GOOGLE_API_KEY = "AIzaSyA9VSywiGyE-2Oe3eV5v3tay3krzx8c5i0";

  useEffect(() => {
    async function translateTextAsync() {
      if (lang !== "en") {
        const translation = await translateText(text, lang);
        setTranslatedText(translation);
      } else {
        setTranslatedText(text);
      }
    }

    translateTextAsync();
  }, [text, lang]);

  async function translateText(text, targetLanguage) {
    try {
      const response = await axios.post(
        `https://translation.googleapis.com/language/translate/v2?key=${GOOGLE_API_KEY}`,
        {
          q: text,
          source: "en",
          target: targetLanguage,
        }
      );
      // Get the translated text
      let translatedText = response.data.data.translations[0].translatedText;
      // Remove "d'" from the translated text
      translatedText = translatedText.replace(/&#39;/g, "'");
      return translatedText;
    } catch (error) {
      console.error("Error translating text:", error);
      return text; // Return original text in case of error
    }
  }

  useEffect(() => {
    async function translateTextAsync() {
      if (lang !== "en") {
        const translation = await translateText(text, targetLanguage);
        setTranslatedText(translation);
      } else {
        setTranslatedText(text);
      }
    }

    translateTextAsync();
  }, [text, targetLanguage]);

  return <>{translatedText}</>;
};

export default Translate;
