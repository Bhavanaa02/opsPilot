"""Diagnostics & AI Troubleshooting Router"""

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Optional
from pydantic import BaseModel
from app.database import get_db
from app.models import Issue, Solution
from app.schemas import SolutionCreate, SolutionResponse
import json

router = APIRouter(
    prefix="/api/diagnostics",
    tags=["diagnostics"],
    responses={404: {"description": "Not found"}},
)

# ═══════════════════════════════════════════════════════════
# DIAGNOSTIC REQUEST/RESPONSE MODELS
# ═══════════════════════════════════════════════════════════

class DiagnosticRequest(BaseModel):
    """Request model for diagnostic analysis"""
    issue_id: int
    description: str

class DiagnosticResponse(BaseModel):
    """Response model for diagnostic results"""
    issue_id: int
    possible_causes: List[str]
    troubleshooting_steps: List[str]
    recommended_commands: List[str]
    next_steps: str

# ═══════════════════════════════════════════════════════════
# RULE-BASED DIAGNOSTICS (Phase 1)
# ═══════════════════════════════════════════════════════════

class DiagnosticEngine:
    """
    Rule-based diagnostic engine for Phase 1
    This will be replaced with LLM in Phase 2
    """
    
    DIAGNOSIS_RULES = {
        "networking": {
            "causes": [
                "Network interface is down",
                "DNS resolution failure",
                "Firewall blocking traffic",
                "Network gateway issue",
                "IP configuration problem"
            ],
            "steps": [
                "Check network connectivity: ping 8.8.8.8",
                "Check DNS: nslookup google.com",
                "Check network interfaces: ip addr show",
                "Check routing: route -n",
                "Check firewall: sudo iptables -L"
            ],
            "commands": ["ping", "nslookup", "ip", "route", "iptables"]
        },
        "hosting": {
            "causes": [
                "Server is down",
                "Service not running",
                "Port not listening",
                "Resource exhaustion",
                "Permission issues"
            ],
            "steps": [
                "Check server status: sudo systemctl status",
                "Check listening ports: netstat -tlnp",
                "Check resource usage: top or free -h",
                "Check logs: sudo journalctl -xe",
                "Restart service: sudo systemctl restart service_name"
            ],
            "commands": ["systemctl", "netstat", "top", "free", "journalctl"]
        },
        "linux": {
            "causes": [
                "Permission denied",
                "File not found",
                "Command not found",
                "Disk space full",
                "Process crashed"
            ],
            "steps": [
                "Check file permissions: ls -la",
                "Check disk space: df -h",
                "Check running processes: ps aux",
                "Check error logs: tail -f /var/log/syslog",
                "Fix permissions: chmod/chown"
            ],
            "commands": ["ls", "df", "ps", "tail", "chmod"]
        },
        "database": {
            "causes": [
                "Database service not running",
                "Connection refused",
                "Authentication failed",
                "Disk space full",
                "Query timeout"
            ],
            "steps": [
                "Check MySQL/PostgreSQL status: sudo systemctl status mysql/postgresql",
                "Check listening port: netstat -tlnp | grep mysql/postgres",
                "Connect to database: mysql -u user -p or psql",
                "Check database logs: tail -f /var/log/mysql/error.log",
                "Check disk space: df -h"
            ],
            "commands": ["systemctl", "netstat", "mysql", "psql", "df"]
        },
        "web_server": {
            "causes": [
                "Apache/Nginx not running",
                "Port already in use",
                "Configuration error",
                "SSL certificate issue",
                "Permission denied"
            ],
            "steps": [
                "Check service status: sudo systemctl status apache2/nginx",
                "Check configuration: sudo apache2ctl -t or nginx -t",
                "Check listening ports: netstat -tlnp",
                "Check error logs: tail -f /var/log/apache2/error.log",
                "Restart service: sudo systemctl restart apache2/nginx"
            ],
            "commands": ["systemctl", "apache2ctl", "nginx", "netstat", "tail"]
        }
    }
    
    @classmethod
    def diagnose(cls, category: str) -> DiagnosticResponse:
        """
        Generate diagnostic response based on category
        """
        rules = cls.DIAGNOSIS_RULES.get(category.lower())
        
        if not rules:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Unknown category: {category}"
            )
        
        return {
            "possible_causes": rules["causes"],
            "troubleshooting_steps": rules["steps"],
            "recommended_commands": rules["commands"],
            "next_steps": "Follow the troubleshooting steps above. If the issue persists, check the knowledge base or escalate."
        }

# ═══════════════════════════════════════════════════════════
# ENDPOINTS
# ═══════════════════════════════════════════════════════════

@router.post("/analyze", response_model=DiagnosticResponse)
async def analyze_issue(
    diagnostic_request: DiagnosticRequest,
    db: Session = Depends(get_db)
):
    """
    Analyze an issue and provide AI-guided troubleshooting
    
    **Request Body:**
    - issue_id: ID of the issue
    - description: Description of the problem
    
    **Returns:**
    - Possible causes
    - Troubleshooting steps
    - Recommended commands
    - Next steps
    """
    # Verify issue exists
    db_issue = db.query(Issue).filter(Issue.id == diagnostic_request.issue_id).first()
    if not db_issue:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Issue not found"
        )
    
    # Generate diagnostic response
    diagnosis = DiagnosticEngine.diagnose(str(db_issue.category))
    
    # Store solution in database
    solution = Solution(
        issue_id=diagnostic_request.issue_id,
        possible_causes=json.dumps(diagnosis["possible_causes"]),
        troubleshooting_steps=json.dumps(diagnosis["troubleshooting_steps"]),
        commands=json.dumps(diagnosis["recommended_commands"]),
        resolution=diagnosis["next_steps"]
    )
    db.add(solution)
    db.commit()
    
    return {
        "issue_id": diagnostic_request.issue_id,
        **diagnosis
    }

@router.get("/{issue_id}/solution", response_model=SolutionResponse)
async def get_solution(
    issue_id: int,
    db: Session = Depends(get_db)
):
    """
    Get the diagnostic solution for an issue
    """
    solution = db.query(Solution).filter(Solution.issue_id == issue_id).first()
    if not solution:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Solution not found for this issue"
        )
    return solution
