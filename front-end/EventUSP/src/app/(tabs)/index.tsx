import HomeHeader from '@/components/HomeHeader';
import MacroGrid from '@/components/MacroGrid';
import RecentMeals from '@/components/RecentMeals';
import { getMeals, Meal } from '@/storage/meals';
import { globalStyles } from '@/styles/global';
import { useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';
import { Image, ScrollView, Text, View, StyleSheet, useWindowDimensions } from 'react-native';
import { EventCard } from "@/components/EventCard";
import { SocialPost } from "@/components/SocialPost";

const images = [
  require('../../../assets/images/Card.png'),
  require('../../../assets/images/card2.jpg'),
  require('../../../assets/images/card3.jpg'),
];

const minhaFoto = require("../../../assets/images/Event.png");


export default function HomeScreen() {
  const { width } = useWindowDimensions();
  const imageWidth = width - 60;
  const imageHeight = 240;
  

  return (
    <ScrollView
      style={globalStyles.container}
      contentContainerStyle={styles.contentContainer}
      showsVerticalScrollIndicator={false}
    >
      <Text style={styles.title}>EventUSP</Text>

      <View style={styles.sliderWrapper}>
        <ScrollView
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          style={styles.slider}
          contentContainerStyle={styles.sliderContent}
        >
          {images.map((imageSource, index) => (
            <Image
              key={index}
              source={imageSource}
              style={[styles.sliderImage, { width: imageWidth, height: imageHeight }]}
              resizeMode="contain"
            />
          ))}
        </ScrollView>
      </View>

      <EventCard />

     <EventCard
        title="Sexta do Rock"
        organizer="FAUD-USP"
        location="FAUD-USP"
        dates="12/08"
        time="18:00 - 23:00"
        free={false}
        image={minhaFoto}
      />

      
      <SocialPost />

      {/* ou customizado: */}
      <SocialPost
        username="Lucar Aura"
        handle="@TheMostAura"
        timeAgo="5h"
        eventName="Junime"
        likes={34}
        comments={8}
      />


    </ScrollView>
  );
}

const styles = StyleSheet.create({
  contentContainer: {
    paddingBottom: 110,
  },
  title: {
    fontSize: 35,
    color: "#fcb827",
    fontFamily: "Montserrat_700Bold",
    paddingLeft: 10,
    paddingBottom: 20,
  },
  sliderWrapper: {
    width: '100%',
    alignItems: 'center',
    marginBottom: 20,
  },
  slider: {
    width: '100%',
  },
  sliderContent: {
    paddingHorizontal: 0,
  },
  sliderImage: {
    borderRadius: 16,
    marginHorizontal: 8,
  },
});