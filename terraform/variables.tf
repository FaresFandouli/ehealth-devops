variable "aws_region" {
  description = "AWS region for resources"
  type        = string
  default     = "eu-west-3"
}

variable "project_name" {
  description = "Project name for resource naming"
  type        = string
  default     = "pds-ehealth"
}

variable "environment" {
  description = "Environment name"
  type        = string
  default     = "production"
}

variable "vpc_cidr" {
  description = "CIDR block for VPC"
  type        = string
  default     = "10.0.0.0/16"
}

variable "instance_type" {
  description = "EC2 instance type"
  type        = string
  default     = "t2.medium"
}

variable "key_name" {
  description = "Name of the SSH key pair"
  type        = string
}

variable "private_key_path" {
  description = "Path to the private SSH key"
  type        = string
  default     = "~/.ssh/pds-k8s-key.pem"
}

variable "allowed_ssh_cidr" {
  description = "CIDR block allowed to SSH into instances (your IP/32 recommended)"
  type        = string
  default     = "0.0.0.0/0"
}
