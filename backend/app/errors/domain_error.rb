class DomainError < StandardError
  attr_reader :code, :status

  def initialize(code, message, status: :unprocessable_entity)
    @code = code
    @status = status
    super(message)
  end
end
