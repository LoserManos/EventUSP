app/schemas.py
    C 57:0 UserUpdateSchema - A (4)
    C 99:0 EventUpdateSchema - A (4)
    C 181:0 OrganizationUpdateSchema - A (4)
    C 5:0 LoginRequest - A (3)
    C 16:0 SignupRequest - A (3)
    M 67:4 UserUpdateSchema.validar_strings_vazias - A (3)
    C 75:0 EventCreateSchema - A (3)
    M 110:4 EventUpdateSchema.validar_strings_vazias - A (3)
    M 120:4 EventUpdateSchema.validar_data_futura - A (3)
    C 144:0 CommentCreateSchema - A (3)
    C 168:0 OrganizationCreateSchema - A (3)
    M 188:4 OrganizationUpdateSchema.validar_strings_vazias - A (3)
    M 11:4 LoginRequest.validar_strings_vazias - A (2)
    M 25:4 SignupRequest.validar_strings_vazias - A (2)
    M 86:4 EventCreateSchema.validar_data_futura - A (2)
    M 93:4 EventCreateSchema.validar_strings_vazias - A (2)
    M 150:4 CommentCreateSchema.validar_conteudo_vazio - A (2)
    M 175:4 OrganizationCreateSchema.validar_strings_vazias - A (2)
    C 30:0 SignupResponse - A (1)
    C 40:0 TokenResponse - A (1)
    C 45:0 UserResponseSchema - A (1)
    C 128:0 EventResponseSchema - A (1)
    C 156:0 PaginatedEventResponse - A (1)
    C 161:0 PaginatedUserResponse - A (1)
app/main.py
    F 13:0 popular_categorias_iniciais - A (3)
    F 25:0 on_startup - A (1)
    F 32:0 root - A (1)
app/database.py
    F 13:0 create_db_and_tables - A (1)
    F 17:0 get_session - A (1)
app/security.py
    F 75:0 get_actual_user - A (4)
    F 22:0 generate_hash_password - A (1)
    F 38:0 verify_password - A (1)
    F 55:0 create_access_token - A (1)
app/models.py
    C 7:0 CategoryType - A (1)
    C 17:0 OrgRole - A (1)
    C 21:0 UserRole - A (1)
    C 26:0 Follower - A (1)
    C 32:0 Likes - A (1)
    C 38:0 Interests - A (1)
    C 44:0 MemberOrganization - A (1)
    C 52:0 User - A (1)
    C 73:0 Organization - A (1)
    C 84:0 Category - A (1)
    C 91:0 Event - A (1)
    C 111:0 Comment - A (1)
    C 121:0 Event_picture - A (1)
app/routes/users.py
    F 42:0 update_profile - B (6)
    F 108:0 follow_user - A (4)
    F 18:0 list_users - A (2)
    F 100:0 get_user_profile - A (2)
    F 129:0 unfollow_user - A (2)
    F 141:0 get_followers - A (2)
    F 150:0 get_following - A (2)
    F 37:0 get_my_profile - A (1)
    F 64:0 delete_my_profile - A (1)
    F 72:0 upload_user_photo - A (1)
app/routes/events.py
    F 32:0 list_events - B (6)
    F 95:0 update_event - B (6)
    F 114:0 delete_event - A (3)
    F 132:0 like_event - A (3)
    F 156:0 interest_event - A (3)
    F 191:0 upload_event_photo - A (3)
    F 86:0 get_event_details - A (2)
    F 177:0 add_comment - A (2)
    F 21:0 create_event - A (1)
    F 67:0 list_following_events - A (1)
app/routes/auth.py
    F 21:0 signup - B (7)
    F 12:0 login - A (3)
app/routes/organizations.py
    F 277:0 demote_member - B (8)
    F 237:0 promote_member - B (7)
    F 321:0 transfer_ownership - B (7)
    F 188:0 leave_organization - B (6)
    F 89:0 update_organization - A (5)
    F 47:0 upload_org_photo - A (4)
    F 123:0 delete_organization - A (4)
    F 151:0 join_organization - A (4)
    F 18:0 create_organization - A (1)
app/schemas.py - A
app/main.py - A
app/database.py - A
app/security.py - A
app/models.py - A
app/routes/users.py - A
app/routes/events.py - A
app/routes/auth.py - A
app/routes/organizations.py - A
app/schemas.py
    LOC: 194
    LLOC: 232
    SLOC: 162
    Comments: 5
    Single comments: 9
    Multi: 0
    Blank: 23
    - Comment Stats
        (C % L): 3%
        (C % S): 3%
        (C + M % L): 3%
app/main.py
    LOC: 33
    LLOC: 27
    SLOC: 25
    Comments: 4
    Single comments: 2
    Multi: 0
    Blank: 6
    - Comment Stats
        (C % L): 12%
        (C % S): 16%
        (C + M % L): 12%
app/database.py
    LOC: 20
    LLOC: 13
    SLOC: 10
    Comments: 3
    Single comments: 5
    Multi: 0
    Blank: 5
    - Comment Stats
        (C % L): 15%
        (C % S): 30%
        (C + M % L): 15%
app/security.py
    LOC: 107
    LLOC: 46
    SLOC: 39
    Comments: 19
    Single comments: 12
    Multi: 41
    Blank: 15
    - Comment Stats
        (C % L): 18%
        (C % S): 49%
        (C + M % L): 56%
app/models.py
    LOC: 126
    LLOC: 180
    SLOC: 110
    Comments: 27
    Single comments: 4
    Multi: 0
    Blank: 12
    - Comment Stats
        (C % L): 21%
        (C % S): 25%
        (C + M % L): 21%
app/routes/users.py
    LOC: 161
    LLOC: 108
    SLOC: 115
    Comments: 25
    Single comments: 20
    Multi: 0
    Blank: 26
    - Comment Stats
        (C % L): 16%
        (C % S): 22%
        (C + M % L): 16%
app/routes/events.py
    LOC: 224
    LLOC: 141
    SLOC: 159
    Comments: 23
    Single comments: 22
    Multi: 0
    Blank: 43
    - Comment Stats
        (C % L): 10%
        (C % S): 14%
        (C + M % L): 10%
app/routes/auth.py
    LOC: 37
    LLOC: 35
    SLOC: 33
    Comments: 1
    Single comments: 1
    Multi: 0
    Blank: 3
    - Comment Stats
        (C % L): 3%
        (C % S): 3%
        (C + M % L): 3%
app/routes/organizations.py
    LOC: 356
    LLOC: 167
    SLOC: 255
    Comments: 40
    Single comments: 38
    Multi: 0
    Blank: 63
    - Comment Stats
        (C % L): 11%
        (C % S): 16%
        (C + M % L): 11%
** Total **
    LOC: 1258
    LLOC: 949
    SLOC: 908
    Comments: 147
    Single comments: 113
    Multi: 41
    Blank: 196
    - Comment Stats
        (C % L): 12%
        (C % S): 16%
        (C + M % L): 15%
