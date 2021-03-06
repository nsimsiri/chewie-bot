export default class Constants {
    // Twitch
    public static readonly TwitchAuthUrl = "https://id.twitch.tv/oauth2/authorize";
    public static readonly TwitchTokenUrl = "https://id.twitch.tv/oauth2/token";
    public static readonly TwitchScopes = "channel:moderate chat:read chat:edit whispers:read whispers:edit";
    public static readonly TwitchClaims =
        // tslint:disable-next-line: quotemark
        '{"id_token":{"email_verified":null}, "userinfo":{"preferred_username"}}';
    public static readonly TwitchCacheAccessToken = "oauth.twitch.accessToken";
    public static readonly TwitchJWKUri = "https://id.twitch.tv/oauth2/keys";
    public static readonly TwitchAPIEndpoint = "https://api.twitch.tv/helix";

    // Streamlabs
    public static readonly StreamlabsAuthUrl = "https://streamlabs.com/api/v1.0/authorize";
    public static readonly StreamlabsTokenUrl = "https://streamlabs.com/api/v1.0/token";
    public static readonly StreamlabsScopes = "donations.read socket.token";
    public static readonly StreamlabsAPIEndpoint = "https://streamlabs.com/api/v1.0";
    public static readonly StreamlabsSocketEndpoint = "https://sockets.streamlabs.com";

    // Youtube
    public static readonly YoutubeVideoUrl = "https://www.googleapis.com/youtube/v3/videos";
}
