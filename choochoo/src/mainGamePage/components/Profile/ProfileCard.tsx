import "./ProfileCard.css";
import { profileImages } from "@/imageImports";

/*
  Creates the player card component used for the main player at the bottom right corner and the other players at the top left corner

  Contains a boolean for main player that changes the css classes depending on if the player is the main player or not
*/
function PlayerCard({
  username,
  trainCount,
  profilePic,
  mainPlayer,
  active,
}: {
  username: string;
  trainCount: number;
  profilePic: string;
  mainPlayer: boolean;
  active: boolean;
}) {
  return (
    <div
      className={mainPlayer ? "main_player_card" : "player_card"}
      data-active={active}
    >
      <img
        className="profile_pic"
        src={profilePic}
        alt={`Profile of ${username}`}
      />
      <div className="player_info">
        <span className="username">{username}</span>
        <span className="train_count">{trainCount} Trains</span>
      </div>
    </div>
  );
}

export default PlayerCard;
