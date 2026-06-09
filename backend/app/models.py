"""Database Models for OpsPilot"""

from sqlalchemy import Column, Integer, String, Text, DateTime, Enum, ForeignKey
from sqlalchemy.orm import relationship
from datetime import datetime
import enum
from app.database import Base

class IssueStatus(str, enum.Enum):
    """Issue Status Enumeration"""
    OPEN = "open"
    INVESTIGATING = "investigating"
    RESOLVED = "resolved"
    CLOSED = "closed"

class IssueCategory(str, enum.Enum):
    """Issue Category Enumeration"""
    NETWORKING = "networking"
    HOSTING = "hosting"
    LINUX = "linux"
    DATABASE = "database"
    SECURITY = "security"
    EMAIL = "email"
    DNS = "dns"
    WEB_SERVER = "web_server"

class Issue(Base):
    """Issue Model - Represents a support issue"""
    __tablename__ = "issues"
    
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(255), nullable=False, index=True)
    description = Column(Text, nullable=True)
    category = Column(Enum(IssueCategory), nullable=False, index=True)
    status = Column(Enum(IssueStatus), default=IssueStatus.OPEN, index=True)
    created_at = Column(DateTime, default=datetime.utcnow, index=True)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    solutions = relationship("Solution", back_populates="issue", cascade="all, delete-orphan")
    
    def __repr__(self):
        return f"<Issue {self.id}: {self.title}>"

class Solution(Base):
    """Solution Model - Troubleshooting guidance for an issue"""
    __tablename__ = "solutions"
    
    id = Column(Integer, primary_key=True, index=True)
    issue_id = Column(Integer, ForeignKey("issues.id"), nullable=False, index=True)
    possible_causes = Column(Text, nullable=True)  # JSON string
    troubleshooting_steps = Column(Text, nullable=True)  # JSON string
    commands = Column(Text, nullable=True)  # JSON string
    resolution = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    issue = relationship("Issue", back_populates="solutions")
    
    def __repr__(self):
        return f"<Solution {self.id} for Issue {self.issue_id}>"

class KnowledgeBase(Base):
    """Knowledge Base Model - Stores resolved issues and solutions"""
    __tablename__ = "knowledge_base"
    
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(255), nullable=False, index=True)
    category = Column(Enum(IssueCategory), nullable=False, index=True)
    problem_description = Column(Text, nullable=False)
    root_cause = Column(Text, nullable=True)
    resolution_steps = Column(Text, nullable=True)  # JSON string
    recommended_commands = Column(Text, nullable=True)  # JSON string
    references = Column(Text, nullable=True)  # JSON string (URLs, docs)
    created_at = Column(DateTime, default=datetime.utcnow, index=True)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    def __repr__(self):
        return f"<KnowledgeBase {self.id}: {self.title}>"
