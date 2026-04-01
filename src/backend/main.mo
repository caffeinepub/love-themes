import Text "mo:core/Text";
import Map "mo:core/Map";
import Array "mo:core/Array";
import Iter "mo:core/Iter";
import Order "mo:core/Order";
import Runtime "mo:core/Runtime";
import Blob "mo:core/Blob";
import Principal "mo:core/Principal";

import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";
import MixinStorage "blob-storage/Mixin";
import Storage "blob-storage/Storage";


actor {
  // Authorization system state
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);
  include MixinStorage();

  // Theme settings
  type Theme = {
    primaryColor : Text;
    accentColor : Text;
    backgroundColor : Text;
    fontStyle : Text;
  };

  // Home section
  type Home = {
    title : Text;
    subtitle : Text;
    heroImageId : Text;
  };

  var theme : Theme = {
    primaryColor = "#f44336";
    accentColor = "#2196f3";
    backgroundColor = "#fffde7";
    fontStyle = "Roboto";
  };

  var home : Home = {
    title = "Our Love Story";
    subtitle = "A journey of memories and moments";
    heroImageId = "";
  };

  // Memories
  type Memory = {
    id : Text;
    title : Text;
    description : Text;
    date : Text;
    imageId : Text;
  };

  let memories = Map.empty<Text, Memory>();

  module Memory {
    public func compare(m1 : Memory, m2 : Memory) : Order.Order {
      Text.compare(m1.title, m2.title);
    };
  };

  // Questions
  type Question = {
    id : Text;
    questionText : Text;
    category : Text;
  };

  module Question {
    public func compare(q1 : Question, q2 : Question) : Order.Order {
      Text.compare(q1.category, q2.category);
    };
  };

  let questions = Map.empty<Text, Question>();

  // Videos
  type Video = {
    id : Text;
    title : Text;
    description : Text;
    videoUrl : Text;
    thumbnailImageId : Text;
  };

  module Video {
    public func compare(v1 : Video, v2 : Video) : Order.Order {
      Text.compare(v1.title, v2.title);
    };
  };

  let videos = Map.empty<Text, Video>();

  // User profiles - using Principal as key for authentication
  public type UserProfile = {
    name : Text;
    bio : Text;
    avatarImageId : Text;
    role : Text;
  };

  let userProfiles = Map.empty<Principal, UserProfile>();

  // Theme settings - open to any caller (frontend handles auth)
  public shared func saveTheme(newTheme : Theme) : async () {
    theme := newTheme;
  };

  public query func getTheme() : async Theme {
    theme;
  };

  // Home section - open to any caller
  public shared func saveHome(newHome : Home) : async () {
    home := newHome;
  };

  public query func getHome() : async Home {
    home;
  };

  // Memories - open to any caller
  public shared func addMemory(memory : Memory) : async () {
    memories.add(memory.id, memory);
  };

  public shared func updateMemory(memory : Memory) : async () {
    memories.add(memory.id, memory);
  };

  public shared func deleteMemory(id : Text) : async () {
    memories.remove(id);
  };

  public query func getMemories() : async [Memory] {
    memories.values().toArray().sort();
  };

  public query func getMemoryById(id : Text) : async Memory {
    switch (memories.get(id)) {
      case (null) { Runtime.trap("Memory not found") };
      case (?memory) { memory };
    };
  };

  // Questions - open to any caller
  public shared func addQuestion(q : Question) : async () {
    questions.add(q.id, q);
  };

  public shared func updateQuestion(q : Question) : async () {
    questions.add(q.id, q);
  };

  public shared func deleteQuestion(id : Text) : async () {
    questions.remove(id);
  };

  public query func getQuestions() : async [Question] {
    questions.values().toArray().sort();
  };

  public query func getQuestionById(id : Text) : async Question {
    switch (questions.get(id)) {
      case (null) { Runtime.trap("Question not found") };
      case (?q) { q };
    };
  };

  // Videos - open to any caller
  public shared func addVideo(video : Video) : async () {
    videos.add(video.id, video);
  };

  public shared func updateVideo(video : Video) : async () {
    videos.add(video.id, video);
  };

  public shared func deleteVideo(id : Text) : async () {
    videos.remove(id);
  };

  public query func getVideos() : async [Video] {
    videos.values().toArray().sort();
  };

  public query func getVideoById(id : Text) : async Video {
    switch (videos.get(id)) {
      case (null) { Runtime.trap("Video not found") };
      case (?video) { video };
    };
  };

  // User profiles
  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    userProfiles.get(caller);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    userProfiles.add(caller, profile);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    userProfiles.get(user);
  };

  // Admin functions for user profile management
  public shared ({ caller }) func adminAddUserProfile(user : Principal, profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can add user profiles");
    };
    userProfiles.add(user, profile);
  };

  public shared ({ caller }) func adminUpdateUserProfile(user : Principal, profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can update user profiles");
    };
    userProfiles.add(user, profile);
  };

  public shared ({ caller }) func adminDeleteUserProfile(user : Principal) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can delete user profiles");
    };
    userProfiles.remove(user);
  };

  public query func getUserProfiles() : async [(Principal, UserProfile)] {
    userProfiles.entries().toArray();
  };
};
