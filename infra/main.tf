terraform {
  required_providers {
    aws = {
      version = ">= 4.0.0"
      source  = "hashicorp/aws"
    }
  }
}

provider "aws" {
  region = "ca-central-1"
}

# two lambda functions w/ function url
# one dynamodb table
# roles and policies as needed
# step functions (if you're going for the bonus marks)


locals {
  s3_arn = "arn:aws:s3:::the-last-show-30129329"
}

# Create a S3 Bucket
resource "aws_s3_bucket" "the-last-show" {
  bucket = "the-last-show-30129329"
  tags   = { Name = "the-last-show" }
}

output "bucket_name" {
  value = aws_s3_bucket.the-last-show.bucket
}

resource "aws_iam_user" "user" {
  name = "nicksavino"
}