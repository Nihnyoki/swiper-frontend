import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';

import { Person } from '@/domains/person/person.types';
import { ChildCard } from './ChildCard';

interface Props {
  children: Person[];
  onSwipeUp: () => void;
  onSwipeDown: () => void;
}

export function ChildStack({
  children,
  onSwipeUp,
  onSwipeDown,
}: Props) {
  if (!children.length) return null;

  return (
    <Swiper
      direction="vertical"
      onSlideNextTransitionEnd={onSwipeUp}
      onSlidePrevTransitionEnd={onSwipeDown}
    >
      {children.map(child => (
        <SwiperSlide key={child.id}>
          <ChildCard person={child} />
        </SwiperSlide>
      ))}
    </Swiper>
  );
}
