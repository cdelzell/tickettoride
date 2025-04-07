import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import Main_Game_Page from "/src/main_game_page/main_game_page.jsx";
import React from "react";

Object.defineProperty(window, "innerWidth", { writable: true, value: 1200 });
Object.defineProperty(window, "innerHeight", { writable: true, value: 800 });

