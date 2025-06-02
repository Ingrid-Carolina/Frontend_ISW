import React from "react";
import './FeaturedPost.css'

const FeaturedPost = ({ title, highlight, date, style }) => {
    const [beforeHighlight, afterHighlight] = title.split(highlight);

    return (
        <div className="featured-post"  style={style}>
            <span className="featured-label">PUBLICACION DESTACADA</span>
            <h2 className="featured-title">
                {beforeHighlight}
                <span className="highlight-year">{highlight}</span>
                {afterHighlight}
            </h2>
            <p className="featured-date">{date}</p>
        </div>
    );
}

export default FeaturedPost;