// import MockChannel from './mock-channel';
/* import MockChannelCreate from './mock-channel-create'; */
// import MockChatList from './mock-chat-list';
// import MockTwoFactorAuth from './mock-two-factor-auth';
// import MockPopups from './mock-popups';
import MockImageError from './mock-image-error';

// export default null;
export default __DEV__ ? MockImageError : null;
