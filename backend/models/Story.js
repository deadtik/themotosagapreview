import { v4 as uuidv4 } from 'uuid';

export class StoryModel {
  constructor(db) {
    this.collection = db.collection('stories');
  }

  async create(storyData) {
    const { userId, title, content, mediaUrls, location } = storyData;

    if (!title || !content || !userId) {
      throw new Error('Title, content and userId are required');
    }

    const story = {
      id: uuidv4(),
      userId,
      title,
      content,
      mediaUrls: mediaUrls || [],
      location: location || '',
      likes: [],
      comments: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    await this.collection.insertOne(story);
    return story;
  }

  async findAll(limit = 50) {
    return await this.collection
      .find({})
      .sort({ createdAt: -1 })
      .limit(limit)
      .toArray();
  }

  async findById(id) {
    return await this.collection.findOne({ id });
  }

  async findByUser(userId) {
    return await this.collection
      .find({ userId })
      .sort({ createdAt: -1 })
      .toArray();
  }

  async toggleLike(storyId, userId) {
    const story = await this.findById(storyId);
    if (!story) {
      throw new Error('Story not found');
    }

    const likes = story.likes || [];
    const hasLiked = likes.includes(userId);

    if (hasLiked) {
      await this.collection.updateOne(
        { id: storyId },
        { $pull: { likes: userId }, $set: { updatedAt: new Date().toISOString() } }
      );
    } else {
      await this.collection.updateOne(
        { id: storyId },
        { $push: { likes: userId }, $set: { updatedAt: new Date().toISOString() } }
      );
    }

    return await this.findById(storyId);
  }

  async addComment(storyId, userId, text) {
    if (!text) {
      throw new Error('Comment text is required');
    }

    const comment = {
      id: uuidv4(),
      userId,
      text,
      createdAt: new Date().toISOString()
    };

    await this.collection.updateOne(
      { id: storyId },
      { $push: { comments: comment }, $set: { updatedAt: new Date().toISOString() } }
    );

    return await this.findById(storyId);
  }

  async delete(storyId) {
    const result = await this.collection.deleteOne({ id: storyId });
    return result.deletedCount > 0;
  }
}
