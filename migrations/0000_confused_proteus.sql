DO $$ BEGIN
 CREATE TYPE "mediaType" AS ENUM('image', 'video');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "privacyType" AS ENUM('public', 'private', 'more');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "account" (
	"userId" uuid NOT NULL,
	"type" text NOT NULL,
	"provider" text NOT NULL,
	"providerAccountId" text NOT NULL,
	"refresh_token" text,
	"access_token" text,
	"expires_at" integer,
	"token_type" text,
	"scope" text,
	"id_token" text,
	"session_state" text,
	CONSTRAINT "account_provider_providerAccountId_pk" PRIMARY KEY("provider","providerAccountId")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "comment" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"content" text NOT NULL,
	"userId" uuid NOT NULL,
	"postId" uuid NOT NULL,
	"createAt" timestamp with time zone DEFAULT now() NOT NULL,
	"updatedAt" timestamp with time zone DEFAULT now() NOT NULL,
	"isOverFlowContent" boolean NOT NULL,
	" privacyType" "privacyType" DEFAULT 'public' NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "like" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"userId" uuid NOT NULL,
	"parentId" uuid NOT NULL,
	"createdAt" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "media" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"type" "mediaType" NOT NULL,
	"url" text NOT NULL,
	"createdAt" timestamp with time zone DEFAULT now() NOT NULL,
	"publicId" text NOT NULL,
	"parentId" uuid NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "passwordResetToken" (
	"userId" uuid NOT NULL,
	"id" uuid DEFAULT gen_random_uuid() NOT NULL,
	"email" text NOT NULL,
	"token" text NOT NULL,
	"expires" timestamp with time zone NOT NULL,
	CONSTRAINT "passwordResetToken_id_token_pk" PRIMARY KEY("id","token"),
	CONSTRAINT "passwordResetToken_token_unique" UNIQUE("token")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "post" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"content" text NOT NULL,
	"userId" uuid NOT NULL,
	"createAt" timestamp with time zone DEFAULT now() NOT NULL,
	"updatedAt" timestamp with time zone DEFAULT now() NOT NULL,
	"isOverFlowContent" boolean NOT NULL,
	" privacyType" "privacyType" DEFAULT 'public' NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "reply" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"content" text NOT NULL,
	"userId" uuid NOT NULL,
	"postId" uuid NOT NULL,
	"commentId" uuid NOT NULL,
	"createAt" timestamp with time zone DEFAULT now() NOT NULL,
	"updatedAt" timestamp with time zone DEFAULT now() NOT NULL,
	"isOverFlowContent" boolean NOT NULL,
	" privacyType" "privacyType" DEFAULT 'public' NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "user" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"email" text NOT NULL,
	"emailVerified" timestamp with time zone,
	"image" text,
	"password" text
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "verificationToken" (
	"userId" uuid NOT NULL,
	"id" uuid DEFAULT gen_random_uuid() NOT NULL,
	"email" text NOT NULL,
	"token" text NOT NULL,
	"expires" timestamp with time zone NOT NULL,
	CONSTRAINT "verificationToken_id_token_pk" PRIMARY KEY("id","token"),
	CONSTRAINT "verificationToken_token_unique" UNIQUE("token")
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "account" ADD CONSTRAINT "account_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "comment" ADD CONSTRAINT "comment_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "comment" ADD CONSTRAINT "comment_postId_post_id_fk" FOREIGN KEY ("postId") REFERENCES "post"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "like" ADD CONSTRAINT "like_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "passwordResetToken" ADD CONSTRAINT "passwordResetToken_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "post" ADD CONSTRAINT "post_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "reply" ADD CONSTRAINT "reply_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "reply" ADD CONSTRAINT "reply_postId_post_id_fk" FOREIGN KEY ("postId") REFERENCES "post"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "reply" ADD CONSTRAINT "reply_commentId_comment_id_fk" FOREIGN KEY ("commentId") REFERENCES "comment"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "verificationToken" ADD CONSTRAINT "verificationToken_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
