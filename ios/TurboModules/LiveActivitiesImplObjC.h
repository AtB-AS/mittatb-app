#import <Foundation/Foundation.h>

NS_ASSUME_NONNULL_BEGIN

@interface LiveActivitiesImpl : NSObject

@property (class, nonatomic, readonly) LiveActivitiesImpl *shared;

@property (nonatomic, copy, nullable) void (^onPushTokenUpdate)(NSDictionary *);
@property (nonatomic, copy, nullable) void (^onActivityEnded)(NSDictionary *);
@property (nonatomic, copy, nullable) void (^onPushToStartTokenUpdate)(NSDictionary *);

- (void)startObservingActivities;

- (void)getActiveActivities:(void (^)(id _Nullable))resolve
                     reject:(void (^)(NSString *, NSString *))reject;

- (void)getPushToStartToken:(void (^)(id _Nullable))resolve
                     reject:(void (^)(NSString *, NSString *))reject;

- (BOOL)areActivitiesEnabled;

- (void)startActivity:(NSString *)attributesJson
     contentStateJson:(NSString *)contentStateJson
              resolve:(void (^)(id _Nullable))resolve
               reject:(void (^)(NSString *, NSString *))reject;

- (void)updateActivity:(NSString *)activityId
      contentStateJson:(NSString *)contentStateJson
               resolve:(void (^)(id _Nullable))resolve
                reject:(void (^)(NSString *, NSString *))reject;

- (void)endActivity:(NSString *)activityId
            resolve:(void (^)(id _Nullable))resolve
             reject:(void (^)(NSString *, NSString *))reject;

- (void)endAllActivities:(void (^)(id _Nullable))resolve
                  reject:(void (^)(NSString *, NSString *))reject;

@end

NS_ASSUME_NONNULL_END
