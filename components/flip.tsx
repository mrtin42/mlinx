'use client';

import { useState } from 'react';
import styles from '@/styles/Flip.module.css';

interface FlipCardProps {
  frontContent: React.ReactNode;
  backContent: React.ReactNode;
}


const FlipCard = ({ frontContent, backContent }: FlipCardProps) => {
  const [isFlipped, setFlipped] = useState(false);

  const handleFlip = () => {
    if (
      navigator.userAgent.match(/Android/i) ||
      navigator.userAgent.match(/webOS/i) ||
      navigator.userAgent.match(/iPhone/i) ||
      navigator.userAgent.match(/iPad/i) ||
      navigator.userAgent.match(/iPod/i) ||
      navigator.userAgent.match(/BlackBerry/i) ||
      navigator.userAgent.match(/Windows Phone/i)
    ) {
      setFlipped(!isFlipped);
    } else {
      return;
    }
  }

  return (
    <div className={`${styles.flipCard} ${isFlipped ? styles.flipped : ''}`} onClick={handleFlip}>
      <div className={styles.flipCardInner}>
        <div className={styles.flipCardFront}>{frontContent}</div>
        <div className={styles.flipCardBack}>{backContent}</div>
      </div>
    </div>
  );
};

export default FlipCard;