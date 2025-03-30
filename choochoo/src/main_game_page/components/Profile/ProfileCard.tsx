import "./ProfileCard.css";

function PlayerCard({
  username,
  trainCount,
  profilePic,
  main_player,
}: {
  username: string;
  trainCount: number;
  profilePic: string;
  main_player: boolean;
  active: boolean;
}) {
  return (
    <div className={main_player ? "main_player_card" : "player_card"}>
      <img className="profile_pic" src={profilePic} alt="Profile" />
      <div className="player_info">
        <span className="username">{username}</span>
        <span className="train_count">{trainCount} Trains</span>
      </div>
    </div>
  );
}

export default PlayerCard;
