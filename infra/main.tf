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

#output bucket name on successful creation
output "bucket_name" {
  value = aws_s3_bucket.the-last-show.bucket
}

# Create IAM user
resource "aws_iam_user" "user" {
  name = "nicksavino"
}

# Create a policy document that allows the user to update the lambda function
data "aws_iam_policy_document" "user" {
  statement {
    effect    = "Allow"
    actions   = ["lambda:UpdateFunctionCode", "s3:*"]
    resources = ["${local.s3_arn}", "${local.s3_arn}/*", "${aws_lambda_function.create-obituary.arn}"]
  }
}


#Create a policy that allows the user to update the lambda function
resource "aws_iam_user_policy" "user" {
  name   = "AllowLambdaUpdate"
  user   = aws_iam_user.user.name
  policy = data.aws_iam_policy_document.user.json
}

# local variables
locals {
  lambda_group                   = "obituary-lambdas"
  get_obituaries_name            = "get_obituary"
  get_obituaries_handler_name    = "get_obituary.handler"
  create_obituaries_name         = "create_obituary"
  create_obituaries_handler_name = "create_obituary.handler"
  artifact_name                  = "artifact.zip"
}

#create a role for the lambda to assume
resource "aws_iam_role" "lambda" {
  name               = "iam-for-lambda-${local.lambda_group}"
  assume_role_policy = <<EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Action": "sts:AssumeRole",
      "Principal": {
        "Service": "lambda.amazonaws.com"
      },
      "Effect": "Allow",
      "Sid": ""
    }
  ]
}
EOF
}


#create-obituary lambda
resource "aws_lambda_function" "create-obituary" {
  role          = aws_iam_role.lambda.arn
  function_name = local.create_obituaries_name
  handler       = local.create_obituaries_handler_name
  s3_bucket     = aws_s3_bucket.the-last-show.bucket
  s3_key        = local.artifact_name

  runtime = "python3.9"
  timeout = 20
}

#get-obituaries lambda
resource "aws_lambda_function" "get-obituaries" {
  role          = aws_iam_role.lambda.arn
  function_name = local.get_obituaries_name
  handler       = local.get_obituaries_handler_name
  s3_bucket     = aws_s3_bucket.the-last-show.bucket
  s3_key        = local.artifact_name

  runtime = "python3.9"
  timeout = 20
}

# create a policy for publishing logs to cloudwatch
resource "aws_iam_policy" "logs" {
  name        = "lambda-logging-${local.lambda_group}"
  description = "IAM policy for logging from a lambda"

  policy = <<EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Action": [
        "logs:CreateLogGroup",
        "logs:CreateLogStream",
        "logs:PutLogEvents"
      ],
      "Resource": "arn:aws:logs:*:*:*",
      "Effect": "Allow"
    }
  ]
}
EOF
}

# attach the above policy to the role
resource "aws_iam_role_policy_attachment" "lambda_logs" {
  role       = aws_iam_role.lambda.name
  policy_arn = aws_iam_policy.logs.arn
}

# create a Function URL for create-obituary lambda 
resource "aws_lambda_function_url" "create-obituary-url" {
  function_name      = aws_lambda_function.create-obituary.function_name
  authorization_type = "NONE"

  cors {
    allow_credentials = true
    allow_origins     = ["*"]
    allow_methods     = ["POST"]
    allow_headers     = ["*"]
    expose_headers    = ["keep-alive", "date"]
  }
}

# show the Function URL after creation
output "create_url" {
  value = aws_lambda_function_url.create-obituary-url.function_url
}

# Create a funciton url for get-obituaries lambda
resource "aws_lambda_function_url" "get-obituaries-url" {
  function_name      = aws_lambda_function.get-obituaries.function_name
  authorization_type = "NONE"

  cors {
    allow_credentials = true
    allow_origins     = ["*"]
    allow_methods     = ["GET"]
    allow_headers     = ["*"]
    expose_headers    = ["keep-alive", "date"]
  }
}

# show the Function URL after creation
output "get_url" {
  value = aws_lambda_function_url.get-obituaries-url.function_url
}