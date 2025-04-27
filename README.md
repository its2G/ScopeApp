# PhotographyApp - Feature/Camera

## 12/06/2024 - started 16:05pm

#### For this ongoing project, I am using React Native to run my applications on. I use this alongside my phone which has the Expo App. The use of the QR code allows me to visualise the project and get an idea of how my project is handled. 

#### I am currently using Supabase for BackEnd and its been good at handling storage (e.g. photos) alongside a table to input user data (usernames and passwords). In future preference, I plan on creating a web server from one of my old computers that will allow me to direct the photos taken to a new directory. I will have to consider how response my server is as its an old computer and hopefully, it will be able to handle my requests. 

  ####  This feature will allow users to take photos and share them with other users. I would like to find out how I could get users to post their content and present this to new users. This is so that I could setup some type of like/dislike system so that whoever gets voted more, will be presented on a leaderboard. Instead of only having one vote, which will be impossible for various users, I am thinking of a like system where whoever gets most likes is put towards the top of the leaderboard. 


## 27/03/2025
  #### I have just added the fetch POST commands to push my photos to my server. I have attempted to use Axios to communicate with the server, but Fetch seemed to work easier for me. I used RNFS to change the path of my file; VisionCamera makes the path of the photos hidden so RNFS is required. 

## 05/04/2025
#### I have began to implement the Swipe Engine, similar to Tinder Swiping Engine. I am successful in fetching the Image URL's stored on my Supabase server and fetching them to my Swipescreen. Soon enough, I will have various images that will allow for users to swipe left and right on images. 


## 09/04/2025
#### Swipe engine is working. Got it to display all the images from the 'Photos' Table. Now I am working on how all the photos that have already been swiped on, does not appear again. 

## 16/04/2025
#### I was undergoing issues with trying to upload my swiping data to my Supabase Table. Also, now each photo is labelled with it's own ID. This makes it easy tracking down each photo. I plan in the future creating a User table so that the swiping information is connected to each user. 

## 21/04/2025
#### I have created an authentication system with the help of Supabase, which allows users to sign up / login. This will safe the users data. Also, this guarantees that each user who's logged in, to save their photos onto the database and can be extracted to their profile page (which I plan on completing very soon). 

## 25/04/2025
#### I have made changes in the mapscreen, allowing for the markers to become clickable. Once clicked on, photos will appear for all the photos that are taken within the area. Also, changes have been made to the mapscreen, meaning that when a user enters the permitted region, the 'swipebutton' will appear, relocating users to the swipescreen. The changes made in the swipe screen is that only photos taken in the area will show up in the swipescreen and users will only have access to liking / disliking photos of that area when clicking the swipe button of that region. 
#### 04:13 - made changes to the swiping screen, now fixing issue where swiping on content does not affect other users

## 27/04/2025
#### Made alot of changes to navigation + swipe screen. Now users will be able to navigate to + from different screens. I have updated changes made to the swipe with the use of buttons to like or dislike photos. Also, I have been able to use EAS build successfully, and now I will be able to send the iOS files to TestFlight for the Beta testing, in preparation for the exhibition. 