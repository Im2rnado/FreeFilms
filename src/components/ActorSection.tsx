import { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";

import PosterOptions from "../types/PosterOptions";

interface ActorProps extends PosterOptions {
    Ref?: any;
    profile_path: string;
    character: string; // Character name
    name: string; // Actor's name
}

interface SectionProps {
    title?: string;
    posters: ActorProps[] // Update to PosterProps to include character and actor names
}

function Actor({ profile_path, character, name, Ref }: ActorProps) {
    return (
        <Link
            ref={Ref}
            className='poster'
            to=""
            style={{
                backgroundImage: (profile_path ? `url(https://image.tmdb.org/t/p/w300${profile_path})` : "url(https://www.themoviedb.org/assets/2/v4/glyphicons/basic/glyphicons-basic-4-user-grey-d8fe957375e70239d6abdd549fd7568c89281b2179b5f4470e2e12895792dfa5.svg)"),
                position: 'relative',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'flex-end',
                padding: '10px',
                boxSizing: 'border-box',
                textDecoration: 'none',
                color: 'white',
                textShadow: '1.2px 1.2px 2px rgba(0,0,0,10)'
            }}>
            <span style={{
                fontWeight: 'bolder',
                fontSize: '1.2em',
                marginBottom: '4px'
            }}>
                {character}
            </span>
            <span style={{
                fontWeight: 'bold',
                fontSize: '1em',
                opacity: 0.8
            }}>
                ({name})
            </span>
        </Link>
    );
}

export default function ActorSection({ title, posters }: SectionProps) {
    const swiper = useRef(null);
    const poster = useRef(null);

    const [index, setIndex] = useState<number>(0);
    const [width, setWidth] = useState<number>(0);
    const [viewable, setViewable] = useState<number>(0);
    const [count, setCount] = useState<number>(0);

    const [transform, setTransform] = useState<number>(0);

    const [startX, setStartX] = useState<number>(0);
    const [currentX, setCurrentX] = useState<number>(0);
    const [isSwiping, setIsSwiping] = useState<boolean>(false);

    function onBack() {
        const newIndex = index - 2;
        const newTransform = (width + 20) * newIndex;

        if (newTransform < 0) {
            setIndex(0);
            setTransform(0);
            return
        };

        setIndex(newIndex);
        setTransform(newTransform);
    }

    function onNext() {
        let newIndex = index + 2;

        if (newIndex > count - viewable) {
            newIndex = count - viewable
        }

        setIndex(newIndex);
        setTransform(newIndex * (width + 20));
    }

    //On resize set poster width and number of VIEWABLE children
    function onResize() {
        if (poster.current) {
            const p = poster.current as HTMLDivElement;

            const w = p.clientWidth;

            if (w) {
                const v = Math.floor((window.innerWidth * 0.9) / w);

                setWidth(w);
                setViewable(v > 6 ? 6 : v);
            }
        }
    }

    //When swiper has ref, set number of children
    function onLoad() {
        if (swiper.current) {
            const sw = swiper.current as HTMLDivElement;

            if (sw.children.length) {
                setCount(sw.children.length);
            }
        }
    }

    useEffect(() => onLoad(), [swiper]);

    useEffect(() => {
        if (!poster.current) return;

        onResize();

        window.addEventListener("resize", onResize);
        return () => window.removeEventListener("resize", onResize);
    }, [poster]);

    // Handle touch start
    function handleTouchStart(e: React.TouchEvent) {
        setStartX(e.touches[0].clientX);
        setIsSwiping(true);
    }

    // Handle touch move
    function handleTouchMove(e: React.TouchEvent) {
        if (!isSwiping) return;
        setCurrentX(e.touches[0].clientX);
    }

    // Handle touch end
    function handleTouchEnd() {
        if (!isSwiping) return;
        const deltaX = startX - currentX;
        const threshold = 50; // Minimum swipe distance to be considered a valid swipe

        if (deltaX > threshold) {
            onNext();
        } else if (deltaX < -threshold) {
            onBack();
        }

        setIsSwiping(false);
    }

    return (
        <div className='poster-section'>
            {
                title &&
                <div className="head">
                    <p className='title'>{title}</p>
                </div>
            }

            <div className='row'>
                <div
                    ref={swiper}
                    className="swiper"
                    style={{
                        transform: `translateX(-${transform}px)`
                    }}
                    onTouchStart={handleTouchStart}
                    onTouchMove={handleTouchMove}
                    onTouchEnd={handleTouchEnd}>
                    {
                        posters.map((v, i) => {
                            return (
                                <Actor key={i} Ref={i === 0 ? poster : undefined} {...v} />
                            )
                        })
                    }
                </div>

                <div className={"row-back" + (index > 0 ? " visible" : "")} onClick={() => onBack()}>
                    <i className="fa-solid fa-angle-left"></i>
                </div>

                <div className={"row-next" + (index < count - viewable ? " visible" : "")} onClick={() => onNext()}>
                    <i className="fa-solid fa-angle-right"></i>
                </div>
            </div>
        </div>
    )
}