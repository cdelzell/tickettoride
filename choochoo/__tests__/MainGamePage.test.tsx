import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import MainGamePage from '../src/main_game_page/main_game_page';
import { BrowserRouter } from 'react-router-dom';

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => jest.fn(),
  useLocation: () => ({
    state: {
      userKey: 'test-key',
      userProfile: {
        username: 'noah-rama',
        wins: 5,
        total_score: 100,
        profile_picture: './src/assets/trains/thomas_train.jpg'
      }
    }
  })
}));

// mock game runner
jest.mock('../src/backend/game-runner', () => {
  return function MockGameRunner() {
    return {
      getMainPlayerTrainCards: () => [2, 2, 2, 2, 2, 2, 2, 2, 5],
      gameBoard: {
        getFaceupTrainCardsAsList: () => ['red', 'blue', 'green', 'yellow', 'wild']
      }
    };
  };
});

jest.mock('../src/backend/user', () => {
  return function MockUser() {
    return {
      name: 'Test'
    };
  };
});

// child compoennts like player card and the face up cards
jest.mock('../src/main_game_page/components/Profile/ProfileCard', () => {
  return function MockPlayerCard({ username, active }: any) {
    return (
      <div data-testid={`player-card-${username}`} className={active ? 'active' : ''}>
        {username}
      </div>
    );
  };
});

jest.mock('../src/main_game_page/components/FaceUpCards/FaceUpCards', () => {
  return function MockFaceUpCards() {
    return <div data-testid="face-up-cards">Face Up Cards</div>;
  };
});

jest.mock('../src/main_game_page/components/DestinationCard/DestinationCard', () => {
  return function MockDestinationCardsCarousel() {
    return <div data-testid="destination-carousel">Destination Cards</div>;
  };
});

jest.mock('../src/main_game_page/components/DestinationCard/DrawDestinationCard', () => {
  return function MockDrawDestinationCard() {
    return <div data-testid="draw-destination">Draw Destination Card</div>;
  };
});

jest.mock('../src/main_game_page/components/PlayerActions/ActionBox', () => {
  return function MockActionBox({ updateStatus, updateDrawDest, updateFaceUp }: any) {
    return (
      <div data-testid="action-box">
        <button onClick={() => updateStatus(1)}>Draw Trains</button>
        <button onClick={() => updateStatus(2)}>Play Trains</button>
        <button onClick={() => updateStatus(3)}>Draw Destination</button>
        <button onClick={() => updateFaceUp(true)}>Activate Face Up</button>
        <button onClick={() => updateDrawDest(true)}>Activate Draw Dest</button>
      </div>
    );
  };
});

jest.mock('../src/main_game_page/components/TrainCard/TrainCard', () => {
  return function MockTrainCard({ game_color, count }: any) {
    return (
      <div data-testid={`train-card-${game_color}`}>
        {game_color}: {count}
      </div>
    );
  };
});

jest.mock('../src/main_game_page/components/Map', () => {
  return function MockMap({ onRouteClaim }: any) {
    return (
      <div data-testid="map">
        <button 
          data-testid="claim-route-button" 
          onClick={() => onRouteClaim({
            source: { name: 'Test Source' },
            target: { name: 'Test Target' },
            game_color: 'red',
            trains: 2
          })}
        >
          Claim Route
        </button>
      </div>
    );
  };
});

// for timers (making sure stuff appears)
beforeEach(() => {
  jest.useFakeTimers();
});

afterEach(() => {
  jest.useRealTimers();
});

describe('MainGamePage Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    
    Object.defineProperty(window, 'innerWidth', { value: 1024 });
    Object.defineProperty(window, 'innerHeight', { value: 768 });
  });

  test('renders player cards for all players', () => {
    render(
      <BrowserRouter>
        <MainGamePage />
      </BrowserRouter>
    );
    
    // is there a main + other players
    expect(screen.getByTestId('player-card-noah-rama')).toBeInTheDocument();
    expect(screen.getByTestId('player-card-c-bear')).toBeInTheDocument();
    expect(screen.getByTestId('player-card-t-dawg')).toBeInTheDocument();
    expect(screen.getByTestId('player-card-ridster')).toBeInTheDocument();
  });

  test('renders face up cards component', () => {
    render(
      <BrowserRouter>
        <MainGamePage />
      </BrowserRouter>
    );
    
    expect(screen.getByTestId('face-up-cards')).toBeInTheDocument();
  });

  test('renders destination cards carousel', () => {
    render(
      <BrowserRouter>
        <MainGamePage />
      </BrowserRouter>
    );
    
    expect(screen.getByTestId('destination-carousel')).toBeInTheDocument();
  });

  test('renders action box component', () => {
    render(
      <BrowserRouter>
        <MainGamePage />
      </BrowserRouter>
    );
    
    expect(screen.getByTestId('action-box')).toBeInTheDocument();
  });

  test('renders map component', () => {
    render(
      <BrowserRouter>
        <MainGamePage />
      </BrowserRouter>
    );
    
    expect(screen.getByTestId('map')).toBeInTheDocument();
  });

  test('renders train cards for the player', () => {
    render(
      <BrowserRouter>
        <MainGamePage />
      </BrowserRouter>
    );
    
    expect(screen.getByTestId('train-card-red')).toBeInTheDocument();
    expect(screen.getByTestId('train-card-yellow')).toBeInTheDocument();
    expect(screen.getByTestId('train-card-black')).toBeInTheDocument();
    expect(screen.getByTestId('train-card-green')).toBeInTheDocument();
    expect(screen.getByTestId('train-card-purple')).toBeInTheDocument();
    expect(screen.getByTestId('train-card-blue')).toBeInTheDocument();
    expect(screen.getByTestId('train-card-brown')).toBeInTheDocument();
    expect(screen.getByTestId('train-card-white')).toBeInTheDocument();
    expect(screen.getByTestId('train-card-wild')).toBeInTheDocument();
  });

  test('end turn button appears after completing an action', async () => {
    render(
      <BrowserRouter>
        <MainGamePage />
      </BrowserRouter>
    );
    expect(screen.queryByText('End Turn')).not.toBeInTheDocument();
    

    fireEvent.click(screen.getByText('Draw Trains'));

    const event = new CustomEvent('drawCard');
    window.dispatchEvent(event);
    window.dispatchEvent(event);
    

    jest.advanceTimersByTime(0);
    

    await waitFor(() => {
      expect(screen.getByText('End Turn')).toBeInTheDocument();
    });
  });

  test('clicking end turn button resets turn state', async () => {
    render(
      <BrowserRouter>
        <MainGamePage />
      </BrowserRouter>
    );
    

    fireEvent.click(screen.getByText('Draw Trains'));

    const event = new CustomEvent('drawCard');
    window.dispatchEvent(event);
    window.dispatchEvent(event);
    

    jest.advanceTimersByTime(0);
    

    await waitFor(() => {
      const endTurnButton = screen.getByText('End Turn');
      expect(endTurnButton).toBeInTheDocument();
      fireEvent.click(endTurnButton);
    });
  
    expect(screen.queryByText('End Turn')).not.toBeInTheDocument();
  });

  test('shows draw destination card component when activated', () => {
    render(
      <BrowserRouter>
        <MainGamePage />
      </BrowserRouter>
    );
    
    expect(screen.queryByTestId('draw-destination')).not.toBeInTheDocument();
    
    // draw destination
    fireEvent.click(screen.getByText('Activate Draw Dest'));
    
    // should be visible
    expect(screen.getByTestId('draw-destination')).toBeInTheDocument();
  });

  test('successful route claim reduces train card count and trains', async () => {
    render(
      <BrowserRouter>
        <MainGamePage />
      </BrowserRouter>
    );
    
    //play trains
    fireEvent.click(screen.getByText('Play Trains'));
    
    // claim route
    fireEvent.click(screen.getByTestId('claim-route-button'));
    
    // timers
    jest.advanceTimersByTime(0);
    
    // is end turn button there
    await waitFor(() => {
      expect(screen.getByText('End Turn')).toBeInTheDocument();
    });
  });

  test('shows notification when drawing a card', async () => {
    render(
      <BrowserRouter>
        <MainGamePage />
      </BrowserRouter>
    );
    
    // draw train
    fireEvent.click(screen.getByText('Draw Trains'));
    
    // draw card
    const event = new CustomEvent('drawCard');
    window.dispatchEvent(event);
    
    // advance timers
    jest.advanceTimersByTime(0);
    
    // check for notifications
    await waitFor(() => {
      expect(screen.getByText(/You drew a .* train card!/)).toBeInTheDocument();
    });
  });

  test('changes active player when ending turn', async () => {
    render(
      <BrowserRouter>
        <MainGamePage />
      </BrowserRouter>
    );
    

    expect(screen.getByTestId('player-card-noah-rama')).toHaveClass('active');
    

    fireEvent.click(screen.getByText('Draw Trains'));
    

    const event = new CustomEvent('drawCard');
    window.dispatchEvent(event);
    window.dispatchEvent(event);
    

    jest.advanceTimersByTime(0);
    

    await waitFor(() => {
      const endTurnButton = screen.getByText('End Turn');
      fireEvent.click(endTurnButton);
    });
    

    expect(screen.getByTestId('player-card-c-bear')).toHaveClass('active');
  });
});