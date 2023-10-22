# version 1
provider "aws" {
  region = "eu-west-2"
}

resource "aws_instance" "cyf_backend" {
  ami           = "ami-0c55b159cbfafe1f0"  # Use an appropriate Amazon Linux 2 AMI ID
  instance_type = "t2.micro"  # Choose an instance type
  key_name      = "your-key-pair-name"  # Create an SSH key pair in AWS and specify the name
  security_groups = ["your-security-group-name"]  # Create a security group in AWS and specify the name
}

resource "aws_security_group" "cyf_backend_sg" {
  name        = "cyf-backend-sg"  # Choose a unique name
  description = "Security group for CYF backend"
  ingress {
    from_port   = 22
    to_port     = 22
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]  # For SSH access, restrict this in production
  }
  # Add more ingress rules for your application as needed
}
