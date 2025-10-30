import React, { useEffect, useRef } from 'react';
import { Animated, Text, View } from 'react-native';

import tw from '../../../lib/tailwind';
import { fadeIn, moveTo, springTo } from '../../../utils/animHelpers';
import Images from '../../../constant/Images';
import GradientText from '../../../components/GradientText';

const TITLE = 'Betsie';

const ANIMATION_CONFIG = {
  ellipseDuration: 1000,
  logoFadeDuration: 100,
  logoMoveUpDuration: 600,
  titleDelay: 80,
  titleDuration: 100,
};

const Splash = ({ onFinish }: { onFinish: () => void }) => {
  // Ellipse animation
  const scaleAnim = useRef(new Animated.Value(1)).current;

  // Logo animations
  const logoTranslateY = useRef(new Animated.Value(0)).current;
  const logoTranslateX = useRef(new Animated.Value(0)).current;
  const logoScale = useRef(new Animated.Value(1)).current;
  const logoOpacity = useRef(new Animated.Value(0)).current; // initially hidden

  // Title animations
  const letterAnimations = useRef(
    TITLE.split('').map(() => ({
      opacity: new Animated.Value(0),
      translateX: new Animated.Value(20), //before 10
    })),
  ).current;

  useEffect(() => {
    runSplashAnimation();
  }, []);

  /** Title animation */
  const animateTitle = () => {
    const animations = letterAnimations.map((anim, index) =>
      Animated.parallel([
        fadeIn(anim.opacity, 1, ANIMATION_CONFIG.titleDuration),
        moveTo(anim.translateX, 0, ANIMATION_CONFIG.titleDuration),
      ]),
    );

    Animated.stagger(ANIMATION_CONFIG.titleDelay, animations).start(() => {
      setTimeout(onFinish, 1000);
    });
  };

  /** Main splash animation sequence */
  const runSplashAnimation = () => {
    // 1. Shrink ellipse
    moveTo(scaleAnim, 0, ANIMATION_CONFIG.ellipseDuration).start(() => {
      // 2. Fade in logo
      fadeIn(logoOpacity, 1, ANIMATION_CONFIG.logoFadeDuration).start(() => {
        // 3. Move logo up
        moveTo(logoTranslateY, -150, ANIMATION_CONFIG.logoMoveUpDuration).start(
          () => {
            // 4. Bounce, scale, and move left together
            Animated.parallel([
              springTo(logoTranslateY, 0, 3), // bounce
              Animated.sequence([
                springTo(logoScale, 1.1),
                springTo(logoScale, 1),
              ]),
              Animated.sequence([
                Animated.delay(2000),
                // springTo(logoTranslateX, -100, 5),
              ]),
            ]).start(animateTitle);
          },
        );
      });
    });
  };

  return (
    <View style={tw`flex-1`}>
      <View style={tw`flex-3 justify-center items-center bg-[#EB4E53]`}>
        {/* Ellipse */}
        <Animated.Image
          source={Images.elipse}
          style={[
            tw`w-64 h-16`,
            {
              transform: [{ scale: scaleAnim }],
              position: 'absolute',
            },
          ]}
          resizeMode="contain"
        />
        <View
          style={tw`flex-row items-center justify-center overflow-visible w-full`}
        >
          {/* Logo */}
          <View style={tw`w-13 h-13 items-center justify-center mr-2`}>
            <Animated.Image
              source={Images.logo}
              style={[
                tw`w-13 h-13`,
                {
                  opacity: logoOpacity,
                  transform: [
                    { translateY: logoTranslateY },
                    { translateX: logoTranslateX },
                    { scale: logoScale },
                  ],
                },
              ]}
              tintColor={'#FFFFFF'}
              resizeMode="contain"
            />
          </View>
          {/* BETSIE Title */}
          <View style={tw`flex-row`}>
            {TITLE.split('').map((letter, index) => {
              const { opacity, translateX } = letterAnimations[index];
              return (
                <Animated.Text
                  key={index}
                  style={[
                    tw`text-[#FFFFFF] text-4xl font-semibold mx-1`,
                    {
                      opacity,
                      transform: [{ translateX }],
                    },
                  ]}
                >
                  {letter}
                </Animated.Text>
              );
            })}
          </View>
        </View>
      </View>

      {/* Bottom section with text and progress indicator */}
      <View style={tw` flex-1 bg-[#FEC7EC]`}>
        <GradientText style={tw`font-shadowsRegular text-center my-6 text-xl`} text="Bets with your besties" />
        
          <GradientText style={tw`text-base font-semibold text-center mt-2`}
            text="Loading..."
          />
         

        {/* <View
          style={tw`relative w-16 h-16 rounded-full border-4 border-gray-300 justify-center items-center`}
        >
          <View
            style={{
              position: 'absolute',
              top: -4,
              left: -4,
              width: 64,
              height: 64,
              borderRadius: 32,
              borderWidth: 4,
              borderColor: 'transparent',
              borderRightColor: '#F472B6',
            }}
          />
          <Text style={tw`text-sm font-semibold`}>100%</Text>
        </View> */}
      </View>
    </View>
  );
};

export default Splash;
