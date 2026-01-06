import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';

import { useFamilyTree } from '../hooks/useFamilyTree';
import { useFamilyTreeGestures } from '../hooks/useFamilyTreeGestures';
import { ActivePersonCard } from './ActivePersonCard';
import { ChildStack } from './ChildStack';

export function FamilyTreeSlider() {
  const {
    activePerson,
    children,
    goToChild,
    goToParent,
    moveSelectionUp,
    moveSelectionDown,
  } = useFamilyTree();

  const gestures = useFamilyTreeGestures({
    goToChild,
    goToParent,
    moveSelectionUp,
    moveSelectionDown,
  });

  if (!activePerson) return null;

  return (
    <>
      <ActivePersonCard person={activePerson} />

      <Swiper
        direction="horizontal"
        onSlideNextTransitionEnd={() =>
          gestures.onHorizontalSwipe('left')
        }
        onSlidePrevTransitionEnd={() =>
          gestures.onHorizontalSwipe('right')
        }
      >
        <SwiperSlide>
          <ChildStack
            children={children}
            onSwipeUp={() => gestures.onVerticalSwipe('up')}
            onSwipeDown={() => gestures.onVerticalSwipe('down')}
          />
        </SwiperSlide>
      </Swiper>
    </>
  );
}
