"""Pydantic Schemas for Request/Response Validation"""

from pydantic import BaseModel, Field
from datetime import datetime
from typing import Optional, List
from enum import Enum

class IssueStatusEnum(str, Enum):
    """Issue Status"""
    OPEN = "open"
    INVESTIGATING = "investigating"
    RESOLVED = "resolved"
    CLOSED = "closed"

class IssueCategoryEnum(str, Enum):
    """Issue Category"""
    NETWORKING = "networking"
    HOSTING = "hosting"
    LINUX = "linux"
    DATABASE = "database"
    SECURITY = "security"
    EMAIL = "email"
    DNS = "dns"
    WEB_SERVER = "web_server"

# ═══════════════════════════════════════════════════════════
# ISSUE SCHEMAS
# ═══════════════════════════════════════════════════════════

class IssueCreate(BaseModel):
    """Schema for creating a new issue"""
    title: str = Field(..., min_length=1, max_length=255)
    description: Optional[str] = None
    category: IssueCategoryEnum

class IssueUpdate(BaseModel):
    """Schema for updating an issue"""
    title: Optional[str] = None
    description: Optional[str] = None
    category: Optional[IssueCategoryEnum] = None
    status: Optional[IssueStatusEnum] = None

class IssueResponse(BaseModel):
    """Schema for issue response"""
    id: int
    title: str
    description: Optional[str]
    category: IssueCategoryEnum
    status: IssueStatusEnum
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True

# ═══════════════════════════════════════════════════════════
# SOLUTION SCHEMAS
# ═══════════════════════════════════════════════════════════

class SolutionCreate(BaseModel):
    """Schema for creating a solution"""
    issue_id: int
    possible_causes: Optional[List[str]] = None
    troubleshooting_steps: Optional[List[str]] = None
    commands: Optional[List[str]] = None
    resolution: Optional[str] = None

class SolutionResponse(BaseModel):
    """Schema for solution response"""
    id: int
    issue_id: int
    possible_causes: Optional[str]
    troubleshooting_steps: Optional[str]
    commands: Optional[str]
    resolution: Optional[str]
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True

# ═══════════════════════════════════════════════════════════
# KNOWLEDGE BASE SCHEMAS
# ═══════════════════════════════════════════════════════════

class KnowledgeBaseCreate(BaseModel):
    """Schema for creating a knowledge base entry"""
    title: str = Field(..., min_length=1, max_length=255)
    category: IssueCategoryEnum
    problem_description: str
    root_cause: Optional[str] = None
    resolution_steps: Optional[List[str]] = None
    recommended_commands: Optional[List[str]] = None
    references: Optional[List[str]] = None

class KnowledgeBaseResponse(BaseModel):
    """Schema for knowledge base response"""
    id: int
    title: str
    category: IssueCategoryEnum
    problem_description: str
    root_cause: Optional[str]
    resolution_steps: Optional[str]
    recommended_commands: Optional[str]
    references: Optional[str]
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True
