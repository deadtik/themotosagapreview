import { StoryModel } from '../models/Story.js';
import { UserModel } from '../models/User.js';
import { getDatabase } from '../config/database.js';

export async function createStory(request, authUser) {
  const db = await getDatabase();
  const storyModel = new StoryModel(db);
  const userModel = new UserModel(db);
  
  const body = await request.json();
  const storyData = {
    ...body,
    userId: authUser.userId
  };
  
  const story = await storyModel.create(storyData);
  
  // Populate user info
  const user = await userModel.findById(authUser.userId);
  story.user = {
    id: user.id,
    name: user.name,
    role: user.role,
    profileImage: user.profileImage
  };
  
  return Response.json(story);
}

export async function getStories() {
  const db = await getDatabase();
  const storyModel = new StoryModel(db);
  const userModel = new UserModel(db);
  
  const stories = await storyModel.findAll();
  
  // Populate user info for each story
  for (let story of stories) {
    const user = await userModel.findById(story.userId);
    if (user) {
      story.user = {
        id: user.id,
        name: user.name,
        role: user.role,
        profileImage: user.profileImage
      };
    }
  }
  
  return Response.json(stories);
}

export async function getStoryById(storyId) {
  const db = await getDatabase();
  const storyModel = new StoryModel(db);
  const userModel = new UserModel(db);
  
  const story = await storyModel.findById(storyId);
  if (!story) {
    return Response.json({ error: 'Story not found' }, { status: 404 });
  }
  
  // Populate user info
  const user = await userModel.findById(story.userId);
  if (user) {
    story.user = {
      id: user.id,
      name: user.name,
      role: user.role,
      profileImage: user.profileImage
    };
  }
  
  return Response.json(story);
}

export async function likeStory(storyId, authUser) {
  const db = await getDatabase();
  const storyModel = new StoryModel(db);
  
  const story = await storyModel.toggleLike(storyId, authUser.userId);
  return Response.json(story);
}

export async function commentOnStory(request, storyId, authUser) {
  const db = await getDatabase();
  const storyModel = new StoryModel(db);
  
  const body = await request.json();
  const { text } = body;
  
  const story = await storyModel.addComment(storyId, authUser.userId, text);
  return Response.json(story);
}

export async function deleteStory(storyId, authUser) {
  const db = await getDatabase();
  const storyModel = new StoryModel(db);
  
  const story = await storyModel.findById(storyId);
  if (!story) {
    return Response.json({ error: 'Story not found' }, { status: 404 });
  }
  
  if (story.userId !== authUser.userId && authUser.role !== 'admin') {
    return Response.json({ error: 'Unauthorized' }, { status: 403 });
  }
  
  await storyModel.delete(storyId);
  return Response.json({ message: 'Story deleted successfully' });
}
