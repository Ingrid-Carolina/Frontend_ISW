import React, { useState } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

// Función mejorada para obtener ID de distintos tipos de URL
function getYouTubeId(url) {
	try {
		const urlObj = new URL(url);
		const hostname = urlObj.hostname;

		if (hostname === "youtu.be") {
			return urlObj.pathname.slice(1);
		}

		if (hostname.includes("youtube.com")) {
			return urlObj.searchParams.get("v");
		}

		return null;
	} catch {
		return null;
	}
}

const VideoCarousel = ({ videos }) => {
	const [currentSlide, setCurrentSlide] = useState(0);

	const settings = {
		dots: true,
		infinite: true,
		speed: 500,
		slidesToShow: 1,
		slidesToScroll: 1,
		arrows: true,
		autoplay: false,
		beforeChange: (_, next) => setCurrentSlide(next),
		nextArrow: <SampleNextArrow />,
		prevArrow: <SamplePrevArrow />,
	};

	return (
		<div style={{ maxWidth: "900px", margin: "auto", position: "relative" }}>
			<Slider {...settings}>
				{videos.map((video, index) => {
					const videoId = getYouTubeId(video.url);
					if (!videoId) {
						return (
							<div key={index}>
								<p style={{ textAlign: "center" }}>
									Video no válido: {video.url}
								</p>
							</div>
						);
					}

					const embedUrl = `https://www.youtube.com/embed/${videoId}?${
						currentSlide === index ? "autoplay=1&mute=1" : "autoplay=0"
					}`;

					return (
						<div key={index}>
							<div style={{ position: "relative", paddingTop: "56.25%" }}>
								<iframe
									src={embedUrl}
									title={`video-${index}`}
									frameBorder="0"
									allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
									allowFullScreen
									style={{
										position: "absolute",
										top: 0,
										left: 0,
										width: "100%",
										height: "100%",
										border: "none",
									}}
								></iframe>
							</div>
						</div>
					);
				})}
			</Slider>
		</div>
	);
};

// Flechas personalizadas más grandes
function SampleNextArrow(props) {
	const { className, onClick } = props;
	return (
		<div
			className={className}
			style={{
				...arrowStyle,
				right: 10,
			}}
			onClick={onClick}
		/>
	);
}

function SamplePrevArrow(props) {
	const { className, onClick } = props;
	return (
		<div
			className={className}
			style={{
				...arrowStyle,
				left: 10,
			}}
			onClick={onClick}
		/>
	);
}

const arrowStyle = {
	zIndex: 2,
	position: "absolute",
	top: "50%",
	transform: "translateY(-50%)",
	width: "40px",
	height: "40px",
	borderRadius: "50%",
	cursor: "pointer",
};

export default VideoCarousel;
