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
  <div className="flex w-full h-full overflow-hidden">
    {/* LEFT: Active Person */}
    <div className="w-full h-full flex-shrink-0">
      <ActivePersonCard person={activePerson} />
    </div>

    {/* RIGHT: Children Swiper */}
    <div className="w-full h-full flex-shrink-0">
      <Swiper
        className="w-full h-full"
        direction="horizontal"
        onSlideNextTransitionEnd={() =>
          gestures.onHorizontalSwipe("left")
        }
        onSlidePrevTransitionEnd={() =>
          gestures.onHorizontalSwipe("right")
        }
      >
        <SwiperSlide className="w-full h-full">
          <ChildStack
            children={children}
            onSwipeUp={() => gestures.onVerticalSwipe("up")}
            onSwipeDown={() => gestures.onVerticalSwipe("down")}
          />
        </SwiperSlide>
      </Swiper>
    </div>
  </div>
);

}
