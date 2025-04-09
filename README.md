
# PhotographyApp - Feature/Camera

  ####  This feature will allow users to take photos and share them with other users. I would like to find out how I could get users to post their content and present this to new users. This is so that I could setup some type of like/dislike system so that whoever gets voted more, will be presented on a leaderboard. Instead of only having one vote, which will be impossible for various users, I am thinking of a like system where whoever gets most likes is put towards the top of the leaderboard. 


## 27/03/2025
  #### I have just added the fetch POST commands to push my photos to my server. I have attempted to use Axios to communicate with the server, but Fetch seemed to work easier for me. I used RNFS to change the path of my file; VisionCamera makes the path of the photos hidden so RNFS is required. 

## 05/04/2025
#### I have began to implement the Swipe Engine, similar to Tinder Swiping Engine. I am successful in fetching the Image URL's stored on my Supabase server and fetching them to my Swipescreen. Soon enough, I will have various images that will allow for users to swipe left and right on images. 


## 09/04/2025
#### Swipe engine is working. Got it to display all the images from the 'Photos' Table. Now I am working on how all the photos that have already been swiped on, does not appear again. 