import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import ActionBox from "main_game_page/components/PlayerActions/ActionBox";

// mock dependencies & functions
const mockUpdateStatus = jest.fn();
const mockUpdateDrawDest = jest.fn();
const mockUpdateTrains = jest.fn();
const mockUpdateFaceUp = jest.fn();
const mockHandleDrawPileClick = jest.fn();
const mockSetDrawClickCount = jest.fn();
const mockSetPlayClickCount = jest.fn();
const mockSetDestClickCount = jest.fn();

// default props
const defaultProps = {
  action: 0,
  updateStatus: mockUpdateStatus,
  updateDrawDest: mockUpdateDrawDest,
  updateTrains: mockUpdateTrains,
  updateFaceUp: mockUpdateFaceUp,
  drawClickCount: 0,
  setDrawClickCount: mockSetDrawClickCount,
  playClickCount: 0,
  setPlayClickCount: mockSetPlayClickCount,
  destClickCount: 0,
  setDestClickCount: mockSetDestClickCount,
  handleDrawPileClick: mockHandleDrawPileClick,
};

describe('ActionBox Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  
});