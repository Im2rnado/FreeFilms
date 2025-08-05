import { useState, useEffect, useRef, Fragment } from "react";
import { Helmet } from "react-helmet";
import { Link, useParams, useSearchParams } from "react-router-dom";
import Notification from "../components/Notification";
import Chat from "../components/Chat";
import conf from "../config";

export default function Player() {
  const { id } = useParams();
  const [s] = useSearchParams();

  const [loaded, setLoaded] = useState<boolean>(false);

  const [type, setType] = useState<"tv" | "movie">();

  const [season, setSeason] = useState<null | number>(null);
  const [episode, setEpisode] = useState<null | number>(null);

  const [maxSeasons, setMaxSeasons] = useState<number>();
  const [maxEpisodes, setMaxEpisodes] = useState(1);
  const [data, setData] = useState<any>();

  const [roomId, setRoomId] = useState<string>("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const socketRef = useRef<WebSocket | null>(null);
  const iframeRef = useRef<HTMLIFrameElement | null>(null);

  const [notification, setNotification] = useState<string | null>(null);
  const [chatMessages, setChatMessages] = useState<Array<{ sender: string; message: string }>>([]);
  const [chatInput, setChatInput] = useState("");
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [userId, setUserId] = useState<string>("Guest");

  const [partyCode, setPartyCode] = useState("");
  const [username, setUsername] = useState("");

  function addViewed(data: any) {
    let viewed = [];

    const storage = localStorage.getItem('viewed');

    if (storage) {
      viewed = JSON.parse(storage);
    }

    const index = viewed.findIndex((v: any) => v.id === data.id && v.type === data.type);

    if (index !== -1) {
      viewed.splice(index, 1);
    }

    viewed.unshift(data);
    viewed = viewed.slice(0, 15);

    localStorage.setItem('viewed', JSON.stringify(viewed));
  }

  function getTitle() {
    let title = data ? data.title || data.original_name : 'Watch';

    if (type == 'tv') title += ` S${season} E${episode}`;

    return title;
  }

  async function getData(typee: string) {
    const req = await fetch(`https://api.themoviedb.org/3/${typee}/${id}?api_key=${conf.API_KEY}&append_to_response=images`);
    const data = await req.json();

    setData(data);

    addViewed({
      id: data.id,
      poster_path: data.poster_path,
      name: data.title || data.original_name,
      title: data.title || data.original_name,
      media_type: typee,
      type: typee
    });
  }

  function showNext() {
    if (!season || !episode || !maxSeasons || !maxEpisodes) {
      return false;
    }

    if (season < maxSeasons || episode < maxEpisodes) {
      return true;
    }

    return false;
  }

  function getNext() {
    if (!season || !episode || !maxSeasons || !maxEpisodes) {
      return "";
    }

    if (episode < maxEpisodes) {
      return `?s=${season}&e=${episode + 1}&ms=${maxSeasons}&me=${maxEpisodes}`;
    }

    if (season < maxSeasons) {
      return `?s=${season + 1}&e=1&ms=${maxSeasons}&me=${maxEpisodes}`;
    }

    return "";
  }

  function onNextClick() {
    setType(undefined);
  }

  // watch party
  // function createWatchParty() {
  //   const newRoomId = partyCode.length >= 5 ? partyCode : Math.random().toString(36).substring(7);
  //   setRoomId(newRoomId);
  //   setUserId(username || "Guest");
  //   connectWebSocket(newRoomId, username);
  // }

  // function joinWatchParty(joinRoomId: string) {
  //   setUsername(username)
  //   setPartyCode(joinRoomId);
  //   setRoomId(joinRoomId);
  //   setUserId(username || "Guest");
  //   connectWebSocket(joinRoomId, username);
  // }

  // const toggleDropdown = () => {
  //   setIsDropdownOpen(!isDropdownOpen);
  // };

  // function connectWebSocket(roomId: string, user: string = userId) {
  //   const wsUrl = `wss://watchparty.freefilms.me/${roomId}`;
  //   socketRef.current = new WebSocket(wsUrl);

  //   socketRef.current.onopen = () => {
  //     console.log(`Connected to party ${roomId}`);
  //     socketRef?.current?.send(JSON.stringify({ event: "joined", senderId: user }));
  //   };

  //   socketRef.current.onmessage = (event) => {
  //     const data = JSON.parse(event.data);

  //     console.log(`New Message: ${data.event}`);

  //     if (data.event == "play" || data.event == "pause" || data.event == "seeked") {
  //       if (iframeRef.current && iframeRef.current.contentWindow) {
  //         iframeRef.current.contentWindow.postMessage({
  //           action: data.event,
  //           time: data.currentTime
  //         }, 'https://embed.su  ');
  //       }
  //     }

  //     if (data.event === "chat") {
  //       setChatMessages(prev => {
  //         const isDuplicate = prev.some(
  //           msg => msg.sender === data.senderId && msg.message === data.message
  //         );

  //         if (!isDuplicate) {
  //           return [...prev, { sender: data.senderId, message: data.message }];
  //         } else {
  //           console.log('Message already exists:', { sender: data.senderId, message: data.message });
  //           return prev;
  //         }
  //       });
  //     }
  //     if (data.event === "joined") {
  //       setNotification(`${data.senderId} has joined the party`);
  //     } else if (data.event === "left") {
  //       setNotification(`${data.senderId} has left the party`);
  //     }

  //   };

  //   socketRef.current.onerror = (error) => {
  //     console.error('WebSocket error:', error);
  //   };

  //   socketRef.current.onclose = () => {
  //     console.log('WebSocket connection closed');
  //   };
  // }

  // function sendVideoEvent(event: string, currentTime: number) {
  //   console.log(`Sending video event: ${event} at ${currentTime}`);
  //   if (roomId && socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
  //     socketRef.current.send(JSON.stringify({ event, currentTime, senderId: userId }));
  //   }
  // }

  // function sendChatMessage(message: string) {
  //   if (roomId && socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
  //     setChatMessages(prev => [...prev, { sender: userId, message }]);
  //     socketRef.current.send(JSON.stringify({ event: "chat", message, senderId: userId }));
  //     setChatInput("");
  //   }
  // }

  // useEffect(() => {
  //   const roomIdFromUrl = s.get('room');
  //   if (roomIdFromUrl) {
  //     setUsername('Guest');
  //     setUserId('Guest');
  //     setPartyCode(roomIdFromUrl);
  //     setRoomId(roomIdFromUrl);
  //     joinWatchParty(roomIdFromUrl);
  //   }

  //   const handleMessage = (event: MessageEvent) => {
  //     if (event.origin === "https://embed.su") {
  //       console.log("Received message from iframe:", event.data);

  //       const data = event.data;
  //       if (data.event === "play" || data.event === "pause" || data.event === "seeked") {
  //         sendVideoEvent(data.event, data.currentTime);
  //       }
  //     }

  //     if (event.origin == 'https://vidlink.pro') {
  //       if (event.data && event.data.type === 'MEDIA_DATA') {
  //         // Get the media data from the message
  //         const mediaData = event.data.data;

  //         // Save the media data to localStorage
  //         localStorage.setItem('vidLinkProgress', JSON.stringify(mediaData));
  //       }
  //     }
  //   };

  //   window.addEventListener("message", handleMessage);


  //   return () => {
  //     // window.removeEventListener('message', handleMessage);
  //     // socketRef.current?.close();
  //   };
  // }, [roomId]);

  useEffect(() => {
    if (!data) return;
    if (!('seasons' in data)) return;

    if (season && season > data.seasons) {
      return;
    }

    if (episode && episode > maxEpisodes) {
      return;
    }
  }, [data, maxEpisodes]);

  useEffect(() => {
    setLoaded(false);

    if (s.has("s") && s.has("e")) {
      let nSeason = parseInt(s.get("s")!);
      let nEpisode = parseInt(s.get("e")!);

      if (!nSeason || !nEpisode) {
        return;
      }

      if (nSeason < 1) nSeason = 1;
      if (nEpisode < 1) nEpisode = 1;

      setType("tv");
      setSeason(nSeason);
      setEpisode(nEpisode);

      if (s.has("ms") && s.has("me")) {
        let mSeasons = parseInt(s.get("ms")!);
        let mEpisodes = parseInt(s.get("me")!);

        if (!mSeasons || !mEpisodes) {
          return;
        }

        if (mSeasons < 1) mSeasons = 1;
        if (mEpisodes < 1) mEpisodes = 1;

        setMaxSeasons(mSeasons);
        setMaxEpisodes(mEpisodes);

        localStorage.setItem(
          'continue_' + id,
          JSON.stringify({
            season: nSeason,
            episode: nEpisode,
          })
        );
      }

      getData("tv");
    } else {
      setType("movie");
      setSeason(null);
      setEpisode(null);

      getData("movie");
    }
  }, [id, s]);

  return (
    <Fragment>
      <Helmet>
        <title>{getTitle()} - {conf.SITE_TITLE}</title>
      </Helmet>

      {!loaded && (
        <div className="loading">
          <div className="spinner">
            <i className="fa-solid fa-spinner"></i>
          </div>
        </div>
      )}

      <div className="player">
        <h2 className="player-title">{getTitle()}</h2>
        {typeof type !== "undefined" && (
          <iframe
            id="iframe"
            ref={iframeRef}
            allowFullScreen
            referrerPolicy="origin"
            title={getTitle()}
            onLoad={() => {
              setLoaded(true);
            }}
            // sandbox="allow-forms allow-pointer-lock allow-same-origin allow-scripts allow-top-navigation"
            src={`https://vidsrc.me/embed/${type}?${id?.startsWith("tt") ? "imdb=" : "tmdb="}${id}${season ? "&season=" + season : ""}${episode ? "&episode=" + episode : ""}`}
          // src={`https://vidlink.pro/${type}/${id}${season ? "/" + season : ""}${episode ? "/" + episode : ""}?primaryColor=df5cff&secondaryColor=df5cff&iconColor=df5cff`}
          ></iframe>
        )}

        {loaded && (
          <div className="overlay">
            <Link to="/">
              <i className="fa-solid fa-home"></i>
            </Link>

            {type && type === "tv" && showNext() && (
              <Link to={getNext()} onClick={() => onNextClick()}>
                <i className="fa-solid fa-forward-step"></i>
              </Link>
            )}

            {/* {!isDropdownOpen && (<a className="none" onClick={toggleDropdown}>
              <i className="fa-solid fa-users"></i>
            </a>)} */}

            {/* {isDropdownOpen && (
              <div className="watch-party-dropdown">
                {!roomId && (
                  <div>
                    <input
                      type="text"
                      placeholder="Party Code (min 5 characters)"
                      value={partyCode}
                      onChange={(e) => setPartyCode(e.target.value)}
                      minLength={5}
                    />
                    <input
                      type="text"
                      placeholder="Username"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                    />
                    <button
                      className="party"
                      onClick={() => createWatchParty()}
                      disabled={partyCode.length < 5 || !username}
                    >
                      Create Watch Party
                    </button>
                    <button
                      className="party"
                      onClick={() => joinWatchParty(partyCode)}
                      disabled={partyCode.length < 5 || !username}
                    >
                      Join Watch Party
                    </button>
                  </div>
                )}

                {roomId && (
                  <div>
                    <button
                      className="party"
                      onClick={() => {
                        navigator.clipboard.writeText(`${window.location.origin}${window.location.pathname}?room=${roomId}`)
                        setNotification('Copied invite link to clipboard');
                        setIsDropdownOpen(false);
                      }
                      }
                    >
                      <h4>Room ID: {roomId}</h4>
                      Copy Invite Link
                    </button>
                    <button className="party" onClick={() => setIsChatOpen(!isChatOpen)}>
                      {isChatOpen ? 'Close Chat' : 'Open Chat'}
                    </button>
                    {isChatOpen && (
                      <Chat
                        me={userId}
                        messages={chatMessages}
                        inputValue={chatInput}
                        onInputChange={(value) => setChatInput(value)}
                        onSendMessage={() => sendChatMessage(chatInput)}
                      />
                    )}
                  </div>
                )}
              </div>
            )} */}
          </div>
        )}
      </div>

      {/* {notification && (
        <Notification
          message={notification}
          onClose={() => setNotification(null)}
        />
      )} */}
    </Fragment>
  );
}
